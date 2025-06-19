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

import { bufferFromBase32 } from "@litert/base32";
import { URL, HOTP } from "../lib";

const TEST_LABEL = 'Example4HOTP';
const TEST_KEY = bufferFromBase32('B4PSUNCFJMQCUEBGEEFSYCTD');

const fnGen1 = HOTP.createGenerator(TEST_KEY);

const seq = 123;

console.log(`API Generated Code: ${HOTP.generate(TEST_KEY, seq)}`);
console.log(`Generator 1 Generated Code: ${fnGen1(seq)}`);

const url = URL.stringify({
    type: 'hotp',
    key: TEST_KEY,
    label: TEST_LABEL,
    digits: 6,
    sequence: seq,
    issuer: '@litert/otp',
});

console.log(`OTP URL: ${url}`);

const urlInfo = URL.parse(url);

console.log(`Parsed URL Info: `, urlInfo);

if (urlInfo.type !== 'hotp') {
    throw new Error('Invalid URL type');
}

const fnGen2 = HOTP.createGenerator(
    urlInfo.key,
    urlInfo.digits,
);

console.log(`Generator 2 Generated Code: ${fnGen2(urlInfo.sequence!)}`);

console.log(`API Generated Code: ${HOTP.generate(urlInfo.key as Buffer, urlInfo.sequence!, urlInfo.digits,)}`);
