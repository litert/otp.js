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

import * as cL from './Constants';
import * as _ from './_internal';

/**
 * Calculate the OTP code using TOTP algorithm.
 *
 * > NOTES:
 * > - Not all authenticator apps support digits other than 6.
 * > - Not all authenticator apps support SHA256 or SHA512.
 * > - Not all authenticator apps support period other than 30 seconds.
 *
 * @param key       The key of TOTP (Buffer or BASE32-encoded string).
 * @param time      The current time in milliseconds. [default: Date.now()]
 * @param digits    The output width of OTP [default: 6].
 * @param period    The code generation interval of TOTP, in second. [default: 30]
 * @param digest    The digest algorithm used to generate the TOTP code. [default: 'SHA1']
 *
 * @returns The generated OTP code.
 */
export function generate(
    key: Buffer | string,
    time = Date.now(),
    digits: number = cL.DEFAULT_DIGITS,
    period: number = cL.DEFAULT_PERIOD,
    digest: cL.EDigest = cL.DEFAULT_DIGEST,
): string {

    _.checkDigest(digest);
    _.checkDigits(digits);
    _.checkPeriod(period);

    return _.hotpGenerate(_.parseKey(key), Math.floor(time / period / 1000), digits, digest);
}

/**
 * Generator function type for TOTP codes.
 */
export interface IGenerator {

    /**
     * The output width of OTP.
     */
    readonly digits: number;

    /**
     * The code generation interval of TOTP, in second.
     */
    readonly period: number;

    /**
     * The digest algorithm used to generate the TOTP code.
     */
    readonly digest: cL.EDigest;

    /**
     * Generate a TOTP code using the configured key and time.
     *
     * @param time  The current time in milliseconds. [default: Date.now()]
     */
    (time?: number): string;
}

/**
 * Create a TOTP code generator function using configuration.
 *
 * > NOTES:
 * > - Not all authenticator apps support digits other than `6`.
 * > - Not all authenticator apps support `SHA256` or `SHA512`.
 * > - Not all authenticator apps support period other than `30` seconds.
 *
 * @param key       The key of TOTP (Buffer or BASE32-encoded string).
 * @param digits    The output width of OTP [default: `6`].
 * @param period    The code generation interval of TOTP, in second. [default: `30`]
 * @param digest    The digest algorithm used to generate the TOTP code [default: `SHA1`].
 *
 * @return The TOTP code generator function.
 * @throws {TypeError} If the `key`, `digits`, or `period` is invalid.
 * @throws {RangeError} If the `digits` or `period` is out of range.
 */
export function createGenerator(
    key: string | Buffer,
    digits: number = cL.DEFAULT_DIGITS,
    period: number = cL.DEFAULT_PERIOD,
    digest: cL.EDigest = cL.DEFAULT_DIGEST,
): IGenerator {

    key = _.parseKey(key);
    _.checkDigits(digits);
    _.checkPeriod(period);
    _.checkDigest(digest);

    const ret = (t = Date.now()): string => _.hotpGenerate(key, Math.floor(t / period / 1000), digits, digest);

    Object.defineProperties(ret, {
        'digits': {
            'value': digits,
            'writable': false,
        },
        'period': {
            'value': period,
            'writable': false,
        },
    });

    return ret as IGenerator;
}
