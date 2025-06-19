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
import { TOTP, URL, Constants } from "../lib";

const TEST_LABEL = 'Example4TOTP';
const TEST_KEY = bufferFromBase32('B4PSUNCFJMQCUEBGEEFSYCTD');

const fnGen1 = TOTP.createGenerator(TEST_KEY);

console.log(`API Generated Code: ${TOTP.generate(TEST_KEY)}`);
console.log(`Generator 1 Generated Code: ${fnGen1()}`);

const url = URL.stringify({
    type: 'totp',
    key: TEST_KEY,
    label: TEST_LABEL,
    digits: 6,
    period: 30,
    issuer: '@litert/otp',
});

console.log(`OTP URL: ${url}`);

const urlInfo = URL.parse(url);

console.log(`Parsed URL Info: `, urlInfo);

if (urlInfo.type !== 'totp') {
    throw new Error('Invalid URL type');
}

const fnGen2 = TOTP.createGenerator(
    urlInfo.key,
    urlInfo.digits,
    urlInfo.period
);

console.log(`Generator 2 Generated Code: ${fnGen2()}`);

console.log(`API Generated Code: ${TOTP.generate(urlInfo.key as Buffer, Date.now(), urlInfo.digits, urlInfo.period)}`);
console.log(`API Generated Code (SHA256): ${TOTP.generate(urlInfo.key as Buffer, Date.now(), 8, urlInfo.period, Constants.EDigest.SHA256)}`);
