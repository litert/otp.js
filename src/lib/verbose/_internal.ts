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

import * as NodeCrypto from 'node:crypto';
import * as LibBase32 from '@litert/base32';
import * as cL from '../Constants';

const hmacBuf = Buffer.allocUnsafe(8);

const codeWidth: number[] = [
    /* 0:  */ 0,
    /* 1:  */ 0,
    /* 2:  */ 0,
    /* 3:  */ 10e2,
    /* 4:  */ 10e3,
    /* 5:  */ 10e4,
    /* 6:  */ 10e5,
    /* 7:  */ 10e6,
    /* 8:  */ 10e7,
    /* 9:  */ 10e8,
    /* 10: */ 10e9,
];

const MAGIC_BYTE_OFFSET = {
    [cL.EDigest.SHA1]: 19,
    [cL.EDigest.SHA256]: 31,
    [cL.EDigest.SHA512]: 63,
};

export interface IVerboseResult {

    code: string;

    hmac: Buffer;

    fullCode: number;

    bitOffset: number;

    sequence: number;

    digits: number;

    digest: cL.EDigest;
}

/**
 * @internal
 */
export function hotpGenerateVerbose(
    key: Buffer,
    sequence: number,
    digits: number,
    digest: cL.EDigest,
): IVerboseResult {

    const hmac = NodeCrypto.createHmac(digest, key);

    hmacBuf.writeUInt32BE(Math.floor(sequence / 0x100000000), 0);
    hmacBuf.writeUInt32BE(sequence % 0x100000000, 4);

    hmac.update(hmacBuf);

    const hResult = hmac.digest();

    const fullCode = hResult.readUInt32BE(hResult[MAGIC_BYTE_OFFSET[digest]] & 0x0F) & 0x7FFFFFFF;
    const code = (fullCode % codeWidth[digits]).
        toString()
        .padStart(digits, '0');

    return {
        code,
        hmac: hResult,
        fullCode,
        bitOffset: hResult[MAGIC_BYTE_OFFSET[digest]] & 0x0F,
        sequence,
        digits,
        digest,
    };
}

/**
 * @throws {TypeError} If the key is not a string or a Buffer.
 * @internal
 */
export function parseKey(key: string | Buffer): Buffer {

    if (typeof key === 'string') {

        return LibBase32.bufferFromBase32(key);
    }

    if (key instanceof Buffer) {

        return key;
    }

    throw new TypeError('Invalid key type. Expected a string or a Buffer.');
}

/**
 * @throws {TypeError} If the digits is not an integer between 3 and 10.
 * @internal
 */
export function checkDigits(digits: number): void {

    if (typeof digits !== 'number' || !Number.isSafeInteger(digits) || digits < 4 || digits > 10) {

        throw new TypeError('The digits must be an integer between 3 and 10.');
    }
}

/**
 * @throws {TypeError} If the period is not a positive integer.
 * @internal
 */
export function checkPeriod(period: number): void {

    if (typeof period !== 'number' || !Number.isSafeInteger(period) || period <= 0) {

        throw new TypeError('The period must be a positive integer.');
    }
}

/**
 * @throws {TypeError} If the digest is not one of 'SHA1', 'SHA256', or 'SHA512'.
 * @internal
 */
export function checkDigest(digest: string): asserts digest is cL.EDigest {

    switch (digest.toUpperCase()) {
        case cL.EDigest.SHA1:
        case cL.EDigest.SHA256:
        case cL.EDigest.SHA512:
            return;
        default:
            throw new TypeError('The digest must be one of "SHA1", "SHA256", or "SHA512".');
    }
}
