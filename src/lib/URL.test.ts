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

import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as LibBase32 from '@litert/base32';
import * as LibURL from './URL';
import * as Constants from './Constants';

NodeTest.describe('URL Utils', () => {

    NodeTest.it('Test TOTP url', () => {

        const url1 = LibURL.stringify({
            type: 'totp',
            key: Buffer.from('12345678901234567890'),
            label: 'Test',
            issuer: 'Litert',
            digits: 6,
            digest: Constants.EDigest.SHA1,
        });
        NodeAssert.strictEqual(url1.startsWith('otpauth://totp/Test?'), true);
        NodeAssert.strictEqual(url1.includes('secret=' + encodeURIComponent(LibBase32.stringToBase32('12345678901234567890'))), true);
        NodeAssert.strictEqual(url1.includes('issuer=Litert'), true);
        NodeAssert.strictEqual(url1.includes('algorithm=SHA1'), true);
        NodeAssert.strictEqual(url1.includes('digits=6'), true);

        const url2 = LibURL.stringify({
            type: 'totp',
            key: Buffer.from('12345 678901234567890'),
            label: '你好/ Hello',
            issuer: '哈哈哈哈 嘿嘿嘿',
            digits: 10,
            digest: Constants.EDigest.SHA256,
        });

        NodeAssert.strictEqual(url2.startsWith(`otpauth://totp/${encodeURIComponent('你好/ Hello')}?`), true);
        NodeAssert.strictEqual(url2.includes('secret=' + encodeURIComponent(LibBase32.stringToBase32('12345 678901234567890'))), true);
        NodeAssert.strictEqual(url2.includes('issuer=' + encodeURIComponent('哈哈哈哈 嘿嘿嘿')), true);
        NodeAssert.strictEqual(url2.includes('algorithm=SHA256'), true);
        NodeAssert.strictEqual(url2.includes('digits=10'), true);

        const url3 = LibURL.stringify({
            type: 'totp',
            key: Buffer.from('12345 678901234567890'),
            label: '你好/ Hello',
            issuer: '哈哈哈哈 嘿嘿嘿',
            digits: 10,
            digest: Constants.EDigest.SHA256,
            betterCompatibility: true,
        });

        NodeAssert.strictEqual(url3.startsWith(`otpauth://totp/${encodeURIComponent('你好/ Hello')}?`), true);
        NodeAssert.strictEqual(url3.includes('secret=' + LibBase32.stringToBase32('12345 678901234567890')), true);
        NodeAssert.strictEqual(url3.includes('issuer=' + encodeURIComponent('哈哈哈哈 嘿嘿嘿')), true);
        NodeAssert.strictEqual(url3.includes('algorithm=SHA256'), true);
        NodeAssert.strictEqual(url3.includes('digits=10'), true);
    });

    NodeTest.it('Test invalid url', () => {

        for (const badUrl of [
            'https://example.com',
            'otpauth://otp/Test',
            'otpauth://otp/Test?a=b',
            'otpauth://otp/Test?secret=12345678901234567890',
        ]) {
            NodeAssert.throws(() => {
                LibURL.parse(badUrl);
            });
        }
    });
});
