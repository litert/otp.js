/**
 * Copyright 2022 Angus.Fenying <fenying@litert.org>
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

import { bufferFromBase32 } from "@litert/encodings";
import * as $OTP from "../lib";

const TEST_LABEL = 'Example4HOTP';
const TEST_SECRET = bufferFromBase32('B4PSUNCFJMQCUEBGEEFSYCTD');

const hotpGenerator = $OTP.createHOTPGenerator(TEST_SECRET);

console.log(hotpGenerator(123));
console.log($OTP.makeHOTPCode(TEST_SECRET, 123));

console.log($OTP.generateHOTPUrl(TEST_SECRET, 123, TEST_LABEL));

const url = $OTP.parseOTPUrl($OTP.generateHOTPUrl(TEST_SECRET, 123, TEST_LABEL));

console.log(url);

console.log($OTP.makeHOTPCode(url.secret, url.sequence!, url.digits));
