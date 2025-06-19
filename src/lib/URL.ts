/**
 * Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as LibBase32 from '@litert/base32';
import * as NodeQS from 'node:querystring';
import * as cL from './Constants';
import * as _ from './_internal';

const URL_PROTOCOL = 'otpauth://';

export interface IUrlInfo {

    /**
     * Do not escape '=' in the key/secret, to improve compatibility with some authenticator apps.
     *
     * @default false
     */
    betterCompatibility?: boolean;

    /**
     * The key of OTP code.
     *
     * If the key is a string, it must be BASE32-encoded.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4226#section-5.1
     */
    key: Buffer | string;

    /**
     * The type of OTP.
     */
    type: 'hotp' | 'totp';

    /**
     * The output width of OTP.
     *
     * @default 6
     *
     * @warning Not all authenticator apps support digits other than 6.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4226#section-5
     */
    digits?: number;

    /**
     * The label of OTP code to display in OTP authenticator app.
     */
    label: string;

    /**
     * The issuer of OTP code to display in OTP authenticator app.
     */
    issuer?: string | null;

    /**
     * The digest algorithm used to generate the OTP code.
     *
     * @warning Not all authenticator apps support SHA256 or SHA512.
     *
     * @default 'SHA1'
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4226#section-5
     * @see https://datatracker.ietf.org/doc/html/rfc6238#section-1.2
     */
    digest?: cL.EDigest;
}

export interface IUrlInfoForHOTP extends IUrlInfo {

    type: 'hotp';

    /**
     * The base sequence of HOTP code.
     *
     * @default 1
     * @see https://datatracker.ietf.org/doc/html/rfc4226#appendix-E.3
     */
    sequence?: number;
}

export interface IUrlInfoForTOTP extends IUrlInfo {

    type: 'totp';

    /**
     * The interval of every TOTP code, in seconds.
     *
     * @default 30
     *
     * @warning Not all authenticator apps support period other than 30 seconds.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc6238#section-4.1
     */
    period?: number;
}

/**
 * Generate a OTP URL which could be used to generate QR code, and then read by the OTP authenticator app.
 *
 * > NOTES:
 * > - Not all authenticator apps support digits other than 6.
 * > - Not all authenticator apps support SHA256 or SHA512.
 * > - Not all authenticator apps support period other than 30 seconds.
 *
 * @param opts  The options for generating the URL.
 *
 * @returns The generated OTP URL.
 */
export function stringify(opts: IUrlInfoForHOTP | IUrlInfoForTOTP): string {

    _.checkDigest(opts.digest ??= cL.DEFAULT_DIGEST);
    _.checkDigits(opts.digits ??= cL.DEFAULT_DIGITS);

    const query: Record<string, string | number> = {
        'secret': typeof opts.key === 'string' ?
            (LibBase32.bufferFromBase32(opts.key), opts.key) :
            LibBase32.bufferToBase32(opts.key),
        'algorithm': opts.digest,
        'digits': opts.digits,
    };

    if (opts.issuer) {

        query.issuer = opts.issuer;
    }

    switch (opts.type) {
        case 'hotp':
            query.sequence = opts.sequence ?? cL.DEFAULT_SEQUENCE;
            break;
        case 'totp':
            query.period = opts.period ?? cL.DEFAULT_PERIOD;
            break;
        default:
            throw new TypeError('Invalid OTP type in URL generation.');
    }

    const ret = `${URL_PROTOCOL}${opts.type}/${encodeURIComponent(opts.label)}?${NodeQS.stringify(query)}`;

    if (opts.betterCompatibility) {

        // Do not escape '=' in the key/secret, to improve compatibility with some authenticator apps.
        return ret.replace(/%3D/g, '=');
    }

    return ret;
}

/**
 * Parse a OTP URL into structure.
 *
 * @param url   The OTP url.
 *
 * @returns The parsed OTP url info.
 * @throws SyntaxError if the URL is invalid.
 */
export function parse(url: string): IUrlInfoForTOTP | IUrlInfoForHOTP {

    if (!url.toLowerCase().startsWith(URL_PROTOCOL)) {

        throw new SyntaxError('Invalid OTP URL.');
    }

    let [type, label, queryString] = url.slice(URL_PROTOCOL.length).split(/[/?]+/);

    if (!type || !label || !queryString) {

        throw new SyntaxError('Invalid OTP URL.');
    }

    const query = NodeQS.parse(queryString);

    if (typeof query.secret !== 'string') {

        throw new SyntaxError('Invalid OTP URL without secret.');
    }

    const algo = query.algorithm ?? cL.DEFAULT_DIGEST;

    _.checkDigest(algo);

    const digits = query.digits ? parseInt(query.digits as string) : cL.DEFAULT_DIGITS;

    _.checkDigits(digits);

    switch (type.toLowerCase()) {
        case 'hotp': {

            const seq = query.sequence ? parseInt(query.sequence as string) : cL.DEFAULT_SEQUENCE;

            if (!Number.isSafeInteger(seq) || seq < 0) {

                throw new SyntaxError('Invalid HOTP url with invalid sequence.');
            }

            const ret: IUrlInfoForHOTP = {
                'type': 'hotp',
                'key': LibBase32.bufferFromBase32(query.secret),
                'label': decodeURI(label),
                'digits': digits,
                'sequence': seq,
                'issuer': typeof query.issuer === 'string' ? query.issuer : null,
                'digest': algo,
            };

            return ret;
        }
        case 'totp': {

            const period = query.period ? parseInt(query.period as string) : cL.DEFAULT_PERIOD;

            _.checkPeriod(period);

            const ret: IUrlInfoForTOTP = {
                'type': 'totp',
                'key': LibBase32.bufferFromBase32(query.secret),
                'label': decodeURI(label),
                'digits': digits,
                'period': period,
                'issuer': typeof query.issuer === 'string' ? query.issuer : null,
                'digest': algo,
            };

            return ret;
        }
        default:
            throw new SyntaxError('Invalid OTP url with unsupported OTP type.');
    }
}
