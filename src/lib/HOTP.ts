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
 * Generate a OTP code using HOTP algorithm, with the given key and sequence.
 *
 * > WARNING: Not all authenticator apps support digits other than 6.
 *
 * @param key       The key of TOTP (Buffer or BASE32-encoded string).
 * @param sequence  The sequence of OTP
 * @param digits    The output width of OTP. [default: 6]
 * @param digest    The digest algorithm used to generate the HOTP code. [default: 'SHA1']
 */
export function generate(
    key: Buffer | string,
    sequence: number,
    digits: number = cL.DEFAULT_DIGITS,
    digest: cL.EDigest = cL.DEFAULT_DIGEST,
): string {

    _.checkDigest(digest);
    _.checkDigits(digits);

    return _.hotpGenerate(_.parseKey(key), sequence, digits, digest);
}

/**
 * Generator function type for HOTP codes.
 */
export interface IGenerator {

    /**
     * The output width of OTP.
     */
    readonly digits: number;

    /**
     * The digest algorithm used to generate the TOTP code.
     */
    readonly digest: cL.EDigest;

    /**
     * Generate a HOTP code using the preferences.
     *
     * @param seq  The sequence of OTP to generate.
     */
    (seq: number): string;
}

/**
 * Create a HOTP code generator function using configuration.
 *
 * @param key       The key of TOTP (Buffer or BASE32-encoded string).
 * @param digits    The output width of OTP [default: 6].
 * @param digest    The digest algorithm used to generate the HOTP code [default: 'SHA1'].
 */
export function createGenerator(
    key: string | Buffer,
    digits: number = cL.DEFAULT_DIGITS,
    digest: cL.EDigest = cL.DEFAULT_DIGEST,
): IGenerator {

    _.checkDigits(digits);
    _.checkDigest(digest);
    key = _.parseKey(key);

    const ret =  (seq: number): string => _.hotpGenerate(key, seq, digits, digest);

    Object.defineProperties(ret, {
        'digits': {
            'value': digits,
            'writable': false,
        },
        'digest': {
            'value': digest,
            'writable': false,
        },
    });

    return ret as IGenerator;
}
