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
import * as HOTP from './HOTP';

NodeTest.describe('HOTP', () => {

    NodeTest.it('Test examples from RFC 4226', () => {

        const key = Buffer.from('12345678901234567890');

        const testCases = [
            { seq: 0, otp: '755224' },
            { seq: 1, otp: '287082' },
            { seq: 2, otp: '359152' },
            { seq: 3, otp: '969429' },
            { seq: 4, otp: '338314' },
            { seq: 5, otp: '254676' },
            { seq: 6, otp: '287922' },
            { seq: 7, otp: '162583' },
            { seq: 8, otp: '399871' },
            { seq: 9, otp: '520489' },
        ];

        const generateHOTP = HOTP.createGenerator(key);
        for (const { seq, otp } of testCases) {
            const resultByAPI = HOTP.generate(key, seq);
            NodeAssert.strictEqual(resultByAPI.length, 6);
            NodeAssert.strictEqual(resultByAPI, otp);

            const resultByGenerator = generateHOTP(seq);
            NodeAssert.strictEqual(resultByGenerator.length, 6);
            NodeAssert.strictEqual(resultByGenerator, otp);
        }
    });
});
