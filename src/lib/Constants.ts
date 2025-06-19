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

/**
 * The default value for the number of digits in an OTP.
 *
 * WARNING: Not all authenticator apps support OTPs with more or less than `6` digits.
 */
export const DEFAULT_DIGITS = 6;

/**
 * The default value for the time period in seconds for which an OTP is valid.
 *
 * WARNING: Not all authenticator apps support periods other than `30` seconds.
 */
export const DEFAULT_PERIOD = 30;

/**
 * The default value for the sequence number in the HOTP.
 */
export const DEFAULT_SEQUENCE = 1;

/**
 * The digest algorithms supported by the OTP generation.
 *
 * WARNING: Not all authenticator apps support all digest algorithms.
 *          The most widely supported is `SHA1`.
 */
export enum EDigest {
    SHA1 = 'SHA1',
    SHA256 = 'SHA256',
    SHA512 = 'SHA512',
}

/**
 * The default value for the digest algorithm used in the OTP generation.
 *
 * WARNING: Not all authenticator apps support all digest algorithms.
 *          The most widely supported is `SHA1`.
 */
export const DEFAULT_DIGEST = EDigest.SHA1;
