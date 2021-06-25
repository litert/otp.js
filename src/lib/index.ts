/**
 * Copyright 2021 Angus.Fenying <fenying@litert.org>
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

import * as $Crypto from 'crypto';
import * as $Enc from '@litert/encodings';

const hmacBuf = Buffer.allocUnsafe(8);
const otpBuf = Buffer.allocUnsafe(4);

const codeWidth: Record<number, number> = {
    4: Math.pow(10, 4),
    5: Math.pow(10, 5),
    6: Math.pow(10, 6),
    7: Math.pow(10, 7),
    8: Math.pow(10, 8),
    9: Math.pow(10, 9),
    10: Math.pow(10, 10),
};

/**
 * Calculate the OTP code using HOTP algorithm.
 *
 * @param secret    The secret of HOTP
 * @param sequence  The sequence of OTP
 * @param digits    The output width of OTP
 */
export function makeHOTPCode(secret: Buffer, sequence: number, digits: number = 6): string {

    const hmac = $Crypto.createHmac('sha1', secret);

    hmacBuf.writeUInt32BE(Math.floor(sequence / 0x100000000), 0);
    hmacBuf.writeUInt32BE(sequence % 0x100000000, 4);

    hmac.update(hmacBuf);

    const hResult = hmac.digest();

    const offset = hResult[19] & 0x0f;

    otpBuf[0] = hResult[offset] & 0x7F;
    otpBuf[1] = hResult[offset + 1] & 0xFF;
    otpBuf[2] = hResult[offset + 2] & 0xFF;
    otpBuf[3] = hResult[offset + 3] & 0xFF;

    const code = (
        ((hResult[offset] & 0x7F) << 24)
        | ((hResult[offset + 1] & 0xFF) << 16)
        | ((hResult[offset + 2] & 0xFF) << 8)
        | (hResult[offset + 3] & 0xFF)
    ) % codeWidth[digits];

    return code.toString().padStart(digits, '0');
}

/**
 * Calculate the OTP code using TOTP algorithm.
 *
 * @param secret    The secret of TOTP
 * @param digits    The output width of OTP
 * @param period  The code generation interval of TOTP, in millisecond.
 */
export function makeTOTPCode(
    secret: Buffer,
    digits: number = 6,
    period: number = 30000
): string {

    return makeHOTPCode(secret, Math.floor(Date.now() / period), digits);
}

export type ITOTPGenerator = () => string;

export type IHOTPGenerator = (sequence: number) => string;

/**
 * Create a TOTP code generator function using configuration.
 *
 * @param secret    The secret of TOTP code.
 * @param digits    The output width of OTP
 * @param period  The code generation interval of TOTP, in millisecond.
 */
export function createTOTPGenerator(
    secret: string | Buffer,
    digits: number = 6,
    period: number = 30000
): ITOTPGenerator {

    if (typeof secret === 'string') {

        secret = $Enc.bufferFromBase32(secret);
    }

    return () => makeHOTPCode(secret as Buffer, Math.floor(Date.now() / period), digits);
}

/**
 * Create a HOTP code generator function using configuration.
 *
 * @param secret    The secret of HOTP code.
 * @param digits    The output width of OTP
 */
export function createHOTPGenerator(
    secret: string | Buffer,
    digits: number = 6
): IHOTPGenerator {

    if (typeof secret === 'string') {

        secret = $Enc.bufferFromBase32(secret);
    }

    return (c) => makeHOTPCode(secret as Buffer, c, digits);
}

/**
 * Create a HOTP url for OTP authenticator app.
 *
 * > Convert the URL into QRCode for scanning.
 *
 * @param secret        The secret of OTP code.
 * @param sequence      The base sequence of HOTP code
 * @param label         The label of OTP code to display in OTP authenticator app.
 * @param issuer        The issuer of OTP code to display in OTP authenticator app.
 * @param digits        The output width of OTP
 */
export function generateHOTPUrl(
    secret: Buffer,
    sequence: number,
    label: string,
    issuer?: string,
    digits: number = 6,
): string {

    const ret = new URL(`otpauth://hotp/${label}`);

    ret.searchParams.set('secret', $Enc.bufferToBase32(secret));

    ret.searchParams.set('algorithm', 'SHA1');
    ret.searchParams.set('digits', digits as any);
    ret.searchParams.set('sequence', sequence as any);

    if (issuer) {

        ret.searchParams.set('issuer', issuer);
    }

    return ret.href;
}

/**
 * Create a TOTP url for OTP authenticator app.
 *
 * > Convert the URL into QRCode for scanning.
 *
 * @param secret    The secret of OTP code.
 * @param label     The label of OTP code to display in OTP authenticator app.
 * @param issuer    The issuer of OTP code to display in OTP authenticator app.
 * @param period  The interval of every TOTP code, in milliseconds.
 * @param digits    The output width of OTP
 */
export function generateTOTPUrl(
    secret: Buffer,
    label: string,
    issuer?: string,
    period: number = 30000,
    digits: number = 6,
): string {

    const ret = new URL(`otpauth://totp/${label}`);

    ret.searchParams.set('secret', $Enc.bufferToBase32(secret));

    ret.searchParams.set('algorithm', 'SHA1');
    ret.searchParams.set('digits', digits as any);
    ret.searchParams.set('period', Math.floor(period / 1000) as any);

    if (issuer) {

        ret.searchParams.set('issuer', issuer);
    }

    return ret.href;
}

export interface IOTPUrlInfo {

    /**
     * The secret of OTP code.
     */
    secret: Buffer;

    /**
     * The type of OTP.
     */
    type: 'hotp' | 'totp';

    /**
     * The output width of OTP.
     */
    digits: number;

    /**
     * The interval of every TOTP code, in milliseconds.
     */
    period?: number;

    /**
     * The base sequence of HOTP code.
     */
    sequence?: number;

    /**
     * The label of OTP code to display in OTP authenticator app.
     */
    label?: string;

    /**
     * The issuer of OTP code to display in OTP authenticator app.
     */
    issuer?: string;
}

export interface IHOTPUrlInfo extends IOTPUrlInfo {

    type: 'hotp';

    sequence: number;

    period?: undefined;
}

export interface ITOTPUrlInfo extends IOTPUrlInfo {

    type: 'totp';

    period: number;

    sequence?: undefined;
}

/**
 * Parse a OTP URL into structure.
 *
 * @param url   The OTP url.
 */
export function parseOTPUrl(url: string): ITOTPUrlInfo | IHOTPUrlInfo {

    const u = new URL(url);

    if (u.protocol !== 'otpauth:') {

        throw new SyntaxError('Invalid OTP URL with incorrect protocol.');
    }

    const ret: IOTPUrlInfo = {} as any;

    if (!u.searchParams.has('secret')) {

        throw new SyntaxError('Invalid OTP URL without secret.');
    }

    ret.secret = $Enc.bufferFromBase32(u.searchParams.get('secret')!);

    switch (u.hostname) {
        case 'hotp':

            ret.type = 'hotp';
            if (u.searchParams.has('sequence')) {

                ret.sequence = parseInt(u.searchParams.get('sequence')!);

                if (!Number.isSafeInteger(ret.sequence) || ret.sequence < 0) {

                    throw new SyntaxError('Invalid HTOP url with invalid sequence.');
                }
            }
            else {

                ret.sequence = 0;
            }
            break;
        case 'totp':

            ret.type = 'totp';
            if (u.searchParams.has('period')) {

                ret.period = parseInt(u.searchParams.get('period')!);

                if (!Number.isSafeInteger(ret.period) || ret.period < 0) {

                    throw new SyntaxError('Invalid HTOP url with invalid period.');
                }

                ret.period *= 1000;
            }
            else {

                ret.period = 30000;
            }
            break;
        default:
            throw new SyntaxError('Invalid HTOP url with unsupported OTP type.');
    }

    if (u.searchParams.has('digits')) {

        ret.digits = parseInt(u.searchParams.get('digits')!);

        if (!Number.isSafeInteger(ret.digits) || ret.digits < 4 || ret.digits > 10) {

            throw new SyntaxError('Invalid HTOP url with invalid digit width.');
        }
    }
    else {

        ret.digits = 6;
    }

    if (u.searchParams.has('label')) {

        ret.label = u.searchParams.get('label')!;
    }

    if (u.searchParams.has('issuer')) {

        ret.issuer = u.searchParams.get('issuer')!;
    }

    return ret as any;
}
