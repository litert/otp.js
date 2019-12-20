/**
 * Copyright 2019 Angus.Fenying <fenying@litert.org>
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

import * as $Url from "url";
import * as $QS from "querystring";
import * as $Enc from "@litert/encodings";
import * as C from "./Common";
import { createHOTPKeyMaker } from "./HOTP";
import { createTOTPKeyMaker } from "./TOTP";

export class OTPFactory implements C.IFactory {

    public createHOTPKeyMaker(opts: C.IHOTPOptions): C.IHOTPKeyMaker {

        return createHOTPKeyMaker(opts);
    }

    public createTOTPKeyMaker(opts: C.ITOTPOptions): C.ITOTPKeyMaker {

        return createTOTPKeyMaker(opts);
    }

    public createKeyMakerFromUrl(url: string): C.ITOTPKeyMaker | C.IHOTPKeyMaker {

        const info = $Url.parse(url);

        const qs = info.query ? $QS.parse(info.query) : {} as Record<string, any>;

        if (info.protocol !== "otpauth:") {

            throw new RangeError("Invalid OTP url: Incorrect protocol.");
        }

        const opts: C.IOptions = {} as any;

        if (info.pathname) {

            opts.label = info.pathname.split("/")[1];
        }
        else {

            opts.label = "Unknown";
        }

        if (!qs.secret || !qs.digits || ![6, 7, 8, 9, 10].includes(parseInt(qs.digits))) {

            throw new RangeError("Invalid OTP url: Lack of digits and secret.");
        }

        opts.secret = $Enc.bufferFromBase32(qs.secret);
        opts.digits = parseInt(qs.digits) as C.TKeyDigits;

        if (qs.issuer) {

            opts.issuer = qs.issuer;
        }

        if (qs.algorithm && qs.algorithm !== "SHA1") {

            throw new RangeError("Invalid OTP url: Invalid hash algorithm.");
        }

        switch (info.hostname) {
        case "hotp":

            if (!qs.counter) {

                opts.counter = 0;
            }
            else if (parseInt(qs.counter).toString() === qs.counter) {

                opts.counter = parseInt(qs.counter);
            }
            else {

                throw new RangeError("Invalid OTP url: Invalid counter for HOTP.");
            }

            return this.createHOTPKeyMaker(opts as C.IHOTPOptions);

        case "totp":

            if (qs.period) {

                if (parseInt(qs.period).toString() === qs.period) {

                    opts.period = parseInt(qs.period);
                }
                else {

                    throw new RangeError("Invalid OTP url: Invalid period for TOTP.");
                }
            }

            return this.createTOTPKeyMaker(opts as C.ITOTPOptions);

        default:

            throw new RangeError("Invalid OTP url: Unknown OTP type.");
        }
    }
}
