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

import { bufferFromBase32 } from "@litert/encodings";
import * as $OTP from "../lib";

const TEST_LABEL = 'Example4TOTP';
const TEST_SECRET = bufferFromBase32('HHALRDEFGHCMMUE23GX5XALFA77U5ORU');

const totpGenerator = $OTP.createTOTPGenerator(TEST_SECRET);

console.log(totpGenerator());
console.log($OTP.makeTOTPCode(TEST_SECRET));

console.log($OTP.generateTOTPUrl(TEST_SECRET, TEST_LABEL));

const url = $OTP.parseOTPUrl($OTP.generateTOTPUrl(TEST_SECRET, TEST_LABEL));

console.log(url);

const totpGenerator2 = $OTP.createTOTPGenerator(url.secret, url.digits, url.period);
console.log(totpGenerator2());
console.log($OTP.makeTOTPCode(url.secret, url.digits, url.period));
