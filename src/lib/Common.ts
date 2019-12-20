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

export type TKeyDigits = 6 | 7 | 8 | 9 | 10;

export type TType = "hotp" | "totp";

export interface IKeyMaker {

    /**
     * The secret of OTP.
     */
    readonly "secret": Buffer;

    /**
     * The digits of OTP.
     */
    readonly "digits": TKeyDigits;

    /**
     * The hash algorithm of OTP.
     */
    readonly "algorithm": "SHA1";

    /**
     * The url of OTP.
     */
    readonly "url": string;

    /**
     * The type of OTP.
     */
    readonly "type": TType;

    /**
     * The name of owner/account that OTP belongs to.
     */
    "label": string;

    /**
     * The name of issuer of OTP.
     */
    "issuer": string;

    /**
     * Get the current OTP code.
     */
    getCode(): string;
}

export interface IOptions {

    /**
     * The secret of this key.
     *
     * RFC-4226 requires the length of secret must be at least 128-bits.
     */
    "secret": string | Buffer;

    /**
     * The name of this key.
     */
    "label": string;

    /**
     * The final output length of key.
     *
     * NOTICES: Not all authenticators implemented this parameter, thus 6 is
     * recommended.
     *
     * @default 6
     */
    "digits"?: TKeyDigits;

    /**
     * The issuer of the key.
     *
     * @default ""
     */
    "issuer"?: string;

    /**
     * The HMAC hash algorithm of the key.
     *
     * NOTICE: According to the RFC-4226, only HMAC-SHA-1 is supported.
     *
     * @default "SHA1"
     */
    "algorithm"?: "SHA1";

    /**
     * The initial counter for HOTP algorithm.
     *
     * @default 0
     */
    "counter"?: number;

    /**
     * The period for TOTP algorithm, in seconds.
     *
     * NOTICE: Not all authenticator implements this parameter, thus 30s is
     * recommended.
     *
     * @default 30
     */
    "period"?: number;
}

export interface IHOTPKeyMaker extends IKeyMaker {

    /**
     * The cursor of HOTP key maker.
     *
     * Manually increase this value to get a new code. RFC-4226 requires
     * increasing the counter only when the last code is validated successfully.
     */
    "counter": number;

    readonly "type": "hotp";
}

export interface ITOTPKeyMaker extends IKeyMaker {

    /**
     * The period of TOTP key maker.
     */
    readonly "period": number;

    readonly "type": "totp";
}

export interface IHOTPOptions extends IOptions {

    "period"?: never;

    "counter": number;
}

export interface ITOTPOptions extends IOptions {

    "counter"?: never;

    "period"?: number;
}

export interface IFactory {

    /**
     * Create a HOTP key maker.
     *
     * @param opts  The options of HOTP.
     */
    createHOTPKeyMaker(opts: IHOTPOptions): IHOTPKeyMaker;

    /**
     * Create a TOTP key maker.
     *
     * @param opts  The options of TOTP.
     */
    createTOTPKeyMaker(opts: ITOTPOptions): ITOTPKeyMaker;

    /**
     * Create a OTP key maker from a URL.
     *
     * @param url   The URL of OTP.
     */
    createKeyMakerFromUrl(url: string): IHOTPKeyMaker | ITOTPKeyMaker;
}

export const DEFAULT_DIGITS = 6;

export const DEFAULT_HOTP_COUNTER = 0;

export const DEFAULT_TOTP_PERIOD = 30;

export const DEFAULT_HASH_ALGO = "SHA1";
