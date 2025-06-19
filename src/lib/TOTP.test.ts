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

import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as LibBase32 from '@litert/base32';
import * as TOTP from './TOTP';
import * as Constants from './Constants';

NodeTest.describe('TOTP', () => {

    NodeTest.it('Test example data', () => {

        const key = Buffer.from('12345678901234567890');
        const keyB32 = LibBase32.bufferToBase32(key);

        const testCases = [
            { time: '2025-06-16T14:45:00.000Z', period: 30, otp: '605819', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T14:45:45.000Z', period: 30, otp: '204160', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T15:07:09.000Z', period: 30, otp: '782203', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:07:36.000Z', period: 30, otp: '621558', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:08:11.000Z', period: 30, otp: '513899', digest: Constants.EDigest.SHA512, },
            { time: '2025-06-16T15:08:31.000Z', period: 30, otp: '671995', digest: Constants.EDigest.SHA512, },

            { time: '2025-06-16T15:09:24.000Z', period: 60, otp: '595013', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T15:11:14.000Z', period: 60, otp: '404190', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T15:11:32.000Z', period: 60, otp: '304528', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:12:00.000Z', period: 60, otp: '390634', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:12:12.000Z', period: 60, otp: '463072', digest: Constants.EDigest.SHA512, },
            { time: '2025-06-16T15:13:22.000Z', period: 60, otp: '273920', digest: Constants.EDigest.SHA512, },

            { time: '2025-06-16T15:14:56.000Z', period: 30, otp: '13446962', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T15:15:32.000Z', period: 30, otp: '13978300', digest: Constants.EDigest.SHA1, },
            { time: '2025-06-16T15:15:51.000Z', period: 30, otp: '74543502', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:16:03.000Z', period: 30, otp: '69377767', digest: Constants.EDigest.SHA256, },
            { time: '2025-06-16T15:16:23.000Z', period: 30, otp: '55833124', digest: Constants.EDigest.SHA512, },
            { time: '2025-06-16T15:16:35.000Z', period: 30, otp: '02305269', digest: Constants.EDigest.SHA512, },
        ] as const;

        for (const { time, period, otp, digest } of testCases) {

            NodeAssert.strictEqual(TOTP.generate(keyB32, Date.parse(time), otp.length, period, digest), otp);
            NodeAssert.strictEqual(TOTP.generate(key, Date.parse(time), otp.length, period, digest), otp);

            const generateTOTP = TOTP.createGenerator(key, otp.length, period, digest);
            const resultByGenerator = generateTOTP(Date.parse(time));
            NodeAssert.strictEqual(resultByGenerator, otp);
        }
    });

    NodeTest.it('Throw error if invalid key is passed', () => {

        NodeAssert.throws(() => {
            TOTP.generate('12345678'); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate(12345 as unknown as string); // Invalid data type of key
        });
    });

    NodeTest.it('Throw error if digits length is out of range', () => {

        TOTP.generate('55555555');
        TOTP.generate('55555555', Date.now(), 4);
        TOTP.generate('55555555', Date.now(), 5);
        TOTP.generate('55555555', Date.now(), 6);
        TOTP.generate('55555555', Date.now(), 7);
        TOTP.generate('55555555', Date.now(), 8);
        TOTP.generate('55555555', Date.now(), 9);
        TOTP.generate('55555555', Date.now(), 10);

        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 0); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), false as unknown as number); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 0.1); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 1); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 2); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 3); // Invalid base32 string
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 11); // Invalid base32 string
        });
    });

    NodeTest.it('Throw error if the period is out of range', () => {
        TOTP.generate('55555555', Date.now(), 4, 10);
        TOTP.generate('55555555', Date.now(), 4, 1);
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 4, 0); // Invalid period
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 4, -1); // Invalid period
        });
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 4, Number.MAX_SAFE_INTEGER + 1); // Invalid period
        });
    });

    NodeTest.it('Throw error if the digest is unsupported', () => {
        TOTP.generate('55555555', Date.now(), 4, 120, Constants.EDigest.SHA1);
        TOTP.generate('55555555', Date.now(), 4, 120, Constants.EDigest.SHA256);
        TOTP.generate('55555555', Date.now(), 4, 120, Constants.EDigest.SHA512);
        NodeAssert.throws(() => {
            TOTP.generate('55555555', Date.now(), 4, 120, 'SHA111' as any); // Invalid digest
        });
    });

});
