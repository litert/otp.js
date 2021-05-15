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
import AbstractKeyMaker from './AbstractKeyMaker';

class TOTPKeyMaker extends AbstractKeyMaker<'totp'> implements C.ITOTPKeyMaker {

    private _periodMS: number;

    public constructor(opts: C.ITOTPOptions) {

        super('totp', opts);

        this._periodMS = this._opts.period * 1000;
    }

    public get period(): number {

        return this._opts.period;
    }

    public getCode(): string {

        return this.getCodeByHOTP(Math.floor(Date.now() / this._periodMS));
    }
}

export function createTOTPKeyMaker(opts: C.ITOTPOptions): C.ITOTPKeyMaker {

    return new TOTPKeyMaker(opts);
}
