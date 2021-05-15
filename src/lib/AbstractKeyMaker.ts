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

import * as C from './Common';
import * as $Crypto from 'crypto';
import * as $URL from 'url';
import * as $Enc from '@litert/encodings';

export default abstract class AbstractKeyMaker<T extends C.TType> implements C.IKeyMaker {

    protected _mod: number;

    protected _opts: Required<C.IOptions>;

    public constructor(
        private _type: T,
        opts: C.IOptions
    ) {

        if (opts.secret.length < 16) {

            throw new RangeError('The length of OTP secret must be at least 128 bits.');
        }

        this._opts = {
            secret: opts.secret instanceof Buffer ? opts.secret : Buffer.from(opts.secret),
            algorithm: C.DEFAULT_HASH_ALGO,
            digits: opts.digits ?? C.DEFAULT_DIGITS,
            label: opts.label,
            counter: opts.counter ?? C.DEFAULT_HOTP_COUNTER,
            issuer: opts.issuer ?? '',
            period: opts.period ?? C.DEFAULT_TOTP_PERIOD
        };

        this._mod = Math.pow(10, this.digits);
    }

    public get type(): T {

        return this._type;
    }

    public get digits(): C.TKeyDigits {

        return this._opts.digits;
    }

    public set digits(v: C.TKeyDigits) {

        this._opts.digits = v;
    }

    public get algorithm(): C.IKeyMaker['algorithm'] {

        return this._opts.algorithm;
    }

    public get secret(): Buffer {

        return this._opts.secret as Buffer;
    }

    public get issuer(): string {

        return this._opts.issuer;
    }

    public set issuer(v: string) {

        this._opts.issuer = v;
    }

    public get label(): string {

        return this._opts.label;
    }

    public set label(v: string) {

        this._opts.label = v;
    }

    public get url(): string {

        const query: Record<string, any> = {
            'secret': $Enc.bufferToBase32(this._opts.secret as Buffer),
            'algorithm': this._opts.algorithm,
            'digits': this._opts.digits
        };

        if (this._opts.issuer) {

            query.issuer = this._opts.issuer;
        }

        if (this._opts.counter) {

            query.counter = this._opts.counter;
        }
        else if (this._opts.period) {

            query.period = this._opts.period;
        }

        return $URL.format({
            'protocol': 'otpauth',                                     // Protocol
            'hostname': `//${this._type}`,                              // Type
            'pathname': `/${encodeURIComponent(this._opts.label)}`,     // Label
            query
        });
    }

    public abstract getCode(): string;

    public getCodeByHOTP(c: number): string {

        const hmac = $Crypto.createHmac('sha1', this._opts.secret);

        const counter = Buffer.allocUnsafe(8);

        counter.writeUInt32BE(Math.floor(c / 0x10000000), 0);
        counter.writeUInt32BE(c % 0x10000000, 4);

        hmac.update(counter);

        const hResult = hmac.digest();

        const offset = hResult[19] & 0x0f;

        const codeBits = Buffer.allocUnsafe(4);

        codeBits[0] = hResult[offset] & 0x7F;
        codeBits[1] = hResult[offset + 1] & 0xFF;
        codeBits[2] = hResult[offset + 2] & 0xFF;
        codeBits[3] = hResult[offset + 3] & 0xFF;

        const code = (
            ((hResult[offset] & 0x7F) << 24)
            | ((hResult[offset + 1] & 0xFF) << 16)
            | ((hResult[offset + 2] & 0xFF) << 8)
            | (hResult[offset + 3] & 0xFF)
        ) % this._mod;

        return code.toString().padStart(this._opts.digits, '0');
    }
}
