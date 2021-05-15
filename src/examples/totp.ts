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

// tslint:disable: no-console

import $OTP from "../lib";

const totp = $OTP.createTOTPKeyMaker({
    digits: 8,
    label: "Example4TOTP" + Math.random(),
    secret: "163uV4MOLEr6FGKF2CEFh",
    issuer: "LiteRT"
});

console.log(totp.getCode());

const totp2 = $OTP.createKeyMakerFromUrl(totp.url);

console.log(totp.url);
console.log(totp2.url);

console.log(totp.getCode());
console.log(totp2.getCode());
