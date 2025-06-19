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
import * as NodeFS from 'node:fs';
import * as NodeAssert from 'node:assert';
import * as LibBase32 from '@litert/base32';
import * as LibOTP from '../lib';
import { EAction, OtpCLI } from './OtpCLI';

const TOTP_TEST_CASES = [
    { time: '2025-06-16T14:45:00.000Z', period: 30, otp: '605819', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T14:45:45.000Z', period: 30, otp: '204160', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T15:07:09.000Z', period: 30, otp: '782203', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:07:36.000Z', period: 30, otp: '621558', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:08:11.000Z', period: 30, otp: '513899', digest: LibOTP.Constants.EDigest.SHA512, },
    { time: '2025-06-16T15:08:31.000Z', period: 30, otp: '671995', digest: LibOTP.Constants.EDigest.SHA512, },

    { time: '2025-06-16T15:09:24.000Z', period: 60, otp: '595013', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T15:11:14.000Z', period: 60, otp: '404190', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T15:11:32.000Z', period: 60, otp: '304528', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:12:00.000Z', period: 60, otp: '390634', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:12:12.000Z', period: 60, otp: '463072', digest: LibOTP.Constants.EDigest.SHA512, },
    { time: '2025-06-16T15:13:22.000Z', period: 60, otp: '273920', digest: LibOTP.Constants.EDigest.SHA512, },

    { time: '2025-06-16T15:14:56.000Z', period: 30, otp: '13446962', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T15:15:32.000Z', period: 30, otp: '13978300', digest: LibOTP.Constants.EDigest.SHA1, },
    { time: '2025-06-16T15:15:51.000Z', period: 30, otp: '74543502', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:16:03.000Z', period: 30, otp: '69377767', digest: LibOTP.Constants.EDigest.SHA256, },
    { time: '2025-06-16T15:16:23.000Z', period: 30, otp: '55833124', digest: LibOTP.Constants.EDigest.SHA512, },
    { time: '2025-06-16T15:16:35.000Z', period: 30, otp: '02305269', digest: LibOTP.Constants.EDigest.SHA512, },
] as const;

const HOTP_TEST_CASES = [
    { seq: 0, otp: '755224', digits: 6, digest: LibOTP.Constants.EDigest.SHA1 },
    { seq: 1, otp: '287082', digits: 6, digest: LibOTP.Constants.EDigest.SHA1 },
    { seq: 5298398, otp: '035371', digits: 6, digest: LibOTP.Constants.EDigest.SHA1 },
    { seq: 583296322, otp: '407680', digits: 6, digest: LibOTP.Constants.EDigest.SHA1 },

    { seq: 0, otp: '875740', digits: 6, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 1, otp: '247374', digits: 6, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 5298398, otp: '343805', digits: 6, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 583296322, otp: '622863', digits: 6, digest: LibOTP.Constants.EDigest.SHA256 },

    { seq: 0, otp: '125165', digits: 6, digest: LibOTP.Constants.EDigest.SHA512 },
    { seq: 1, otp: '342147', digits: 6, digest: LibOTP.Constants.EDigest.SHA512 },
    { seq: 5298398, otp: '490622', digits: 6, digest: LibOTP.Constants.EDigest.SHA512 },
    { seq: 583296322, otp: '660685', digits: 6, digest: LibOTP.Constants.EDigest.SHA512 },

    { seq: 0, otp: '74875740', digits: 8, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 1, otp: '32247374', digits: 8, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 5298398, otp: '88343805', digits: 8, digest: LibOTP.Constants.EDigest.SHA256 },
    { seq: 583296322, otp: '54622863', digits: 8, digest: LibOTP.Constants.EDigest.SHA256 },
];

NodeTest.describe('CLI', () => {

    const TEST_KEY_RAW = '12345678901234567890';

    NodeTest.it('Test HOTP', () => {

        for (const { seq, otp, digits, digest } of HOTP_TEST_CASES) {

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '-d', `${digits}`, '-D', digest]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-t', 'hotp', '--key', LibBase32.stringToBase32(TEST_KEY_RAW), '--sequence', `${seq}`, '--digits', `${digits}`, '--digest', digest]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-t', 'hotp', '--key', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '--digits', `${digits}`, '--digest', digest]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-t', 'hotp', '--key', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '-d', `${digits}`, '-D', digest]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '-d', `${digits}`, '-D', digest]),
                [ [otp], 0 ],
            );

            if (digest === LibOTP.Constants.EDigest.SHA1) {
                NodeAssert.deepStrictEqual(
                    new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '-d', `${digits}`]),
                    [ [otp], 0 ],
                );
            }

            if (digits === 6) {
                NodeAssert.deepStrictEqual(
                    new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', `${seq}`, '-D', `${digest}`]),
                    [ [otp], 0 ],
                );
            }

            const url = LibOTP.URL.stringify({
                type: 'hotp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: digits || 6,
            });

            NodeAssert.deepStrictEqual(
                new OtpCLI().process(['-u', url, '-S', `${seq}`]),
                [ [otp], 0 ],
            );
        }
    });

    NodeTest.it('Test HOTP verbose TEXT output', () => {

        for (const { seq, otp, digits, digest } of HOTP_TEST_CASES) {

            const [vResult, vExitCode] = new OtpCLI().process([
                '-t', 'hotp',
                '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                '-S', `${seq}`,
                '-d', `${digits}`,
                '-D', digest,
                '-V',
            ]);

            NodeAssert.strictEqual(vExitCode, 0);
            NodeAssert.strictEqual(vResult[0], `HOTP Code:  ${otp}`);
            NodeAssert.strictEqual(vResult[1], `Key:        base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(vResult[2], `Digits:     ${digits}`);
            NodeAssert.strictEqual(vResult[3], `Digest:     ${digest}`);
            NodeAssert.strictEqual(vResult[4], `Sequence:   ${seq}`);
        }
    });

    NodeTest.it('Test HOTP verbose TEXT output by url', () => {

        for (const { seq, otp, digits, digest } of HOTP_TEST_CASES) {

            const url = LibOTP.URL.stringify({
                type: 'hotp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: digits || 6,
            });

            const [vResult, vExitCode] = new OtpCLI().process([
                '-u', url,
                '-S', `${seq}`,
                '-V',
            ]);

            NodeAssert.strictEqual(vExitCode, 0);
            NodeAssert.strictEqual(vResult[0], `HOTP Code:  ${otp}`);
            NodeAssert.strictEqual(vResult[1], `Key:        base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(vResult[2], `Digits:     ${digits}`);
            NodeAssert.strictEqual(vResult[3], `Digest:     ${digest}`);
            NodeAssert.strictEqual(vResult[4], `Sequence:   ${seq}`);
        }
    });

    NodeTest.it('Test HOTP verbose JSON output', () => {

        for (const { seq, otp, digits, digest } of HOTP_TEST_CASES) {

            const [vJsonResult, vJsonExitCode] = new OtpCLI().process([
                '-t', 'hotp',
                '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                '-S', `${seq}`,
                '-d', `${digits}`,
                '-D', digest,
                '-V', '--json-output',
            ]);

            NodeAssert.strictEqual(vJsonExitCode, 0);

            const vJsonObj = JSON.parse(vJsonResult.join('\n'));

            NodeAssert.strictEqual(vJsonObj.code, otp);
            NodeAssert.strictEqual(vJsonObj.key, LibBase32.stringToBase32(TEST_KEY_RAW));
            NodeAssert.strictEqual(vJsonObj.digits, digits);
            NodeAssert.strictEqual(vJsonObj.digest, digest);
            NodeAssert.strictEqual(vJsonObj.sequence, seq);
        }
    });

    NodeTest.it('Test HOTP verbose JSON output by url', () => {

        for (const { seq, otp, digits, digest } of HOTP_TEST_CASES) {

            const url = LibOTP.URL.stringify({
                type: 'hotp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: digits || 6,
            });

            const [vJsonResult, vJsonExitCode] = new OtpCLI().process([
                '-u', url,
                '-S', `${seq}`,
                '-V', '--json-output',
            ]);

            NodeAssert.strictEqual(vJsonExitCode, 0);

            const vJsonObj = JSON.parse(vJsonResult.join('\n'));

            NodeAssert.strictEqual(vJsonObj.code, otp);
            NodeAssert.strictEqual(vJsonObj.key, LibBase32.stringToBase32(TEST_KEY_RAW));
            NodeAssert.strictEqual(vJsonObj.digits, digits);
            NodeAssert.strictEqual(vJsonObj.digest, digest);
            NodeAssert.strictEqual(vJsonObj.sequence, seq);
        }
    });

    NodeTest.it('Test invalid HOTP sequence', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', '']),
            [ [`Error: Invalid sequence "". It must be a non-negative integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', 'abc']),
            [ [`Error: Invalid sequence "abc". It must be a non-negative integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', '1.5']),
            [ [`Error: Invalid sequence "1.5". It must be a non-negative integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-t', 'hotp', '-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-S', '1111111111111111111111111111']),
            [ [`Error: Invalid sequence "1111111111111111111111111111". It must be a non-negative integer.`], -1 ],
        );
    });

    NodeTest.it('Test TOTP', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW)]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        for (const { time, period, otp, digest } of TOTP_TEST_CASES) {

            const url = LibOTP.URL.stringify({
                type: 'totp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: otp.length,
                period,
            });

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '-T', time,
                    '-p', period.toString(),
                    '-d', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '-T', time,
                    '-p', period.toString(),
                    '-d', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '-p', period.toString(),
                    '-d', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '-d', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '--digest', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '--digest', digest,
                    '-t', 'totp',
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '--digest', digest,
                    '--type', 'totp',
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '--digest', digest,
                    '--type', 'totp',
                    '-a', 'code',
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--key', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '--time', time,
                    '--period', period.toString(),
                    '--digits', otp.length.toString(),
                    '--digest', digest,
                    '--type', 'totp',
                    '--action', 'code',
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                    '-T', Math.floor(Date.parse(time) / 1000).toString(),
                    '-p', period.toString(),
                    '-d', otp.length.toString(),
                    '-D', digest,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '--url', url,
                    '-T', time,
                ]),
                [ [otp], 0 ],
            );

            NodeAssert.deepStrictEqual(
                new OtpCLI().process([
                    '-u', url,
                    '-T', time,
                ]),
                [ [otp], 0 ],
            );
        }
    });

    NodeTest.it('Test invalid timestamp for TOTP', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-T', '']),
            [ [`Error: Invalid time "". It must be a valid UNIX timestamp or date string.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-T', 'abc']),
            [ [`Error: Invalid time "abc". It must be a valid UNIX timestamp or date string.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-T', '123.456']),
            [ [`Error: Invalid time "123.456". It must be a valid UNIX timestamp or date string.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-T', '1111111111111111111111111111']),
            [ [`Error: Invalid time "1111111111111111111111111111". It must be a valid UNIX timestamp or date string.`], -1 ],
        );
    });

    NodeTest.it('Test digits length', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-d', '']),
            [ [`Error: Invalid digits length "". It must be an integer between 4 and 10.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-d', 'abc']),
            [ [`Error: Invalid digits length "abc". It must be an integer between 4 and 10.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-d', '3']),
            [ [`Error: Invalid digits length "3". It must be an integer between 4 and 10.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-d', '11']),
            [ [`Error: Invalid digits length "11". It must be an integer between 4 and 10.`], -1 ],
        );

        for (let i = 4; i <= 10; i++) {

            const [[otp], exitCode] = new OtpCLI().process([
                '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                '-d', i.toString(),
            ]);

            NodeAssert.strictEqual(exitCode, 0);
            NodeAssert.strictEqual(otp.length, i, `Digits length should be ${i}, but got ${otp.length}`);
        }
    });

    NodeTest.it('Test TOTP period', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-p', '']),
            [ [`Error: Invalid period "". It must be a positive integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-p', 'abc']),
            [ [`Error: Invalid period "abc". It must be a positive integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-p', '0']),
            [ [`Error: Invalid period "0". It must be a positive integer.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-p', '30.1']),
            [ [`Error: Invalid period "30.1". It must be a positive integer.`], -1 ],
        );

        for (const period of [10, 30, 60, 120, 300]) {

            const [[otp], exitCode] = new OtpCLI().process([
                '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                '-p', period.toString(),
            ]);

            NodeAssert.strictEqual(exitCode, 0);
            NodeAssert.strictEqual(otp.length, 6, `Digits length should be 6, but got ${otp.length}`);
        }
    });

    NodeTest.it('Test TOTP digest', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-D', '']),
            [ [`Error: Invalid digest "". It must be one of "SHA1", "SHA256", or "SHA512".`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-D', 'abc']),
            [ [`Error: Invalid digest "abc". It must be one of "SHA1", "SHA256", or "SHA512".`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', LibBase32.stringToBase32(TEST_KEY_RAW), '-D', 'sha0']),
            [ [`Error: Invalid digest "sha0". It must be one of "SHA1", "SHA256", or "SHA512".`], -1 ],
        );

        for (const digest of [
            LibOTP.Constants.EDigest.SHA1,
            LibOTP.Constants.EDigest.SHA256,
            LibOTP.Constants.EDigest.SHA512,
        ]) {

            const [[otp], exitCode] = new OtpCLI().process([
                '-k', LibBase32.stringToBase32(TEST_KEY_RAW),
                '-D', digest,
            ]);

            NodeAssert.strictEqual(exitCode, 0);
            NodeAssert.strictEqual(otp.length, 6, `Digits length should be 6, but got ${otp.length}`);
        }
    });

    NodeTest.it('Test TOTP verbose TEXT output', () => {

        for (const { time, period, otp, digest } of TOTP_TEST_CASES) {

            const [verboseMsg, verboseExitCode] = new OtpCLI().process([
                '-k', `raw:${TEST_KEY_RAW}`,
                '-T', time,
                '-p', period.toString(),
                '-d', otp.length.toString(),
                '-D', digest,
                '-V',
            ]);

            NodeAssert.strictEqual(verboseMsg[0], `TOTP Code:  ${otp}`);
            NodeAssert.strictEqual(verboseMsg[1], `Key:        base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(verboseMsg[2], `Time:       ${new Date(time).toISOString()}`);
            NodeAssert.strictEqual(verboseMsg[3], `Period:     ${period} seconds`);
            NodeAssert.strictEqual(verboseMsg[4], `Digits:     ${otp.length}`);
            NodeAssert.strictEqual(verboseMsg[5], `Digest:     ${digest}`);

            NodeAssert.strictEqual(verboseExitCode, 0);
        }
    });

    NodeTest.it('Test TOTP verbose TEXT output by url', () => {

        for (const { time, period, otp, digest } of TOTP_TEST_CASES) {

            const url = LibOTP.URL.stringify({
                type: 'totp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: otp.length,
                period,
            });

            const [verboseMsg, verboseExitCode] = new OtpCLI().process([
                '-u', url,
                '-T', time,
                '-V',
            ]);

            NodeAssert.strictEqual(verboseMsg[0], `TOTP Code:  ${otp}`);
            NodeAssert.strictEqual(verboseMsg[1], `Key:        base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(verboseMsg[2], `Time:       ${new Date(time).toISOString()}`);
            NodeAssert.strictEqual(verboseMsg[3], `Period:     ${period} seconds`);
            NodeAssert.strictEqual(verboseMsg[4], `Digits:     ${otp.length}`);
            NodeAssert.strictEqual(verboseMsg[5], `Digest:     ${digest}`);

            NodeAssert.strictEqual(verboseExitCode, 0);
        }
    });

    NodeTest.it('Test TOTP verbose JSON output', () => {

        for (const { time, period, otp, digest } of TOTP_TEST_CASES) {

            const [verboseJsonMsg, verboseJsonExitCode] = new OtpCLI().process([
                '-k', `raw:${TEST_KEY_RAW}`,
                '-T', time,
                '-p', period.toString(),
                '-d', otp.length.toString(),
                '-D', digest,
                '-V', '--json-output',
            ]);

            const vJsonObj = JSON.parse(verboseJsonMsg.join('\n'));

            NodeAssert.strictEqual(vJsonObj.code, otp);
            NodeAssert.strictEqual(vJsonObj.key, LibBase32.stringToBase32(TEST_KEY_RAW));
            NodeAssert.strictEqual(vJsonObj.time, new Date(time).toISOString());
            NodeAssert.strictEqual(vJsonObj.period, period);
            NodeAssert.strictEqual(vJsonObj.digits, otp.length);
            NodeAssert.strictEqual(vJsonObj.digest, digest);

            NodeAssert.strictEqual(verboseJsonExitCode, 0);
        }
    });

    NodeTest.it('Test TOTP verbose JSON output by url', () => {

        for (const { time, period, otp, digest } of TOTP_TEST_CASES) {

            const url = LibOTP.URL.stringify({
                type: 'totp',
                key: Buffer.from(TEST_KEY_RAW),
                label: 'Test1',
                digest,
                digits: otp.length,
                period,
            });

            const [verboseJsonMsg, verboseJsonExitCode] = new OtpCLI().process([
                '-u', url,
                '-T', time,
                '-V', '-j'
            ]);

            const vJsonObj = JSON.parse(verboseJsonMsg.join('\n'));

            NodeAssert.strictEqual(vJsonObj.code, otp);
            NodeAssert.strictEqual(vJsonObj.key, LibBase32.stringToBase32(TEST_KEY_RAW));
            NodeAssert.strictEqual(vJsonObj.time, new Date(time).toISOString());
            NodeAssert.strictEqual(vJsonObj.period, period);
            NodeAssert.strictEqual(vJsonObj.digits, otp.length);
            NodeAssert.strictEqual(vJsonObj.digest, digest);

            NodeAssert.strictEqual(verboseJsonExitCode, 0);
        }
    });

    NodeTest.it('Test URL generation', () => {

        for (const { period, otp, digest } of TOTP_TEST_CASES) {

            const [urlResult, urlExitCode] = new OtpCLI().process([
                '-k', `raw:${TEST_KEY_RAW}`,
                '-p', period.toString(),
                '-d', otp.length.toString(),
                '-D', digest,
                '--action', EAction.GENERATE_URL,
                '-L', 'Test1',
            ]);

            NodeAssert.strictEqual(urlResult[0].startsWith('otpauth://totp/'), true);
            NodeAssert.strictEqual(urlExitCode, 0);
        }

        for (const { seq, otp, digest } of HOTP_TEST_CASES) {

            const [[urlResult], urlExitCode] = new OtpCLI().process([
                `-t`, 'hotp',
                '-k', `raw:${TEST_KEY_RAW}`,
                '-S', seq.toString(),
                '-d', otp.length.toString(),
                '-D', digest,
                '--action', EAction.GENERATE_URL,
                '-L', 'Test1',
            ]);

            NodeAssert.strictEqual(urlResult.startsWith('otpauth://hotp/'), true);
            NodeAssert.strictEqual(urlResult.includes(`sequence=${seq}`), true);
            NodeAssert.strictEqual(urlResult.includes(`algorithm=${digest}`), true);
            NodeAssert.strictEqual(urlExitCode, 0);
        }

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-k', `raw:${TEST_KEY_RAW}`,
                '--action', EAction.GENERATE_URL,
            ]),
            [ [`Error: The --label option is required.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-t', 'hotp',
                '-k', `raw:${TEST_KEY_RAW}`,
                '--action', EAction.GENERATE_URL,
            ]),
            [ [`Error: The --label option is required.`], -1 ],
        );
    });

    NodeTest.it('Test URL inspection', () => {

        for (const { digest, digits, period, label, issuer } of [
            { digest: '', digits: 0, period: 0, label: 'Test1', issuer: '' },
            { digest: LibOTP.Constants.EDigest.SHA1, digits: 6, period: 30, label: 'Test2', issuer: '' },
            { digest: LibOTP.Constants.EDigest.SHA256, digits: 8, period: 60, label: 'Test3', issuer: 'Hello' },
        ]) {

            const url = LibOTP.URL.stringify({
                type: 'totp',
                key: Buffer.from(TEST_KEY_RAW),
                label,
                issuer: issuer || null,
                digest: (digest || undefined) as LibOTP.Constants.EDigest.SHA1,
                digits: digits || undefined,
                period: period || undefined,
            });

            const [inspectResult, inspectExitCode] = new OtpCLI().process([
                '-a', 'inspect-url',
                '-u', url,
                '-V',
            ]);

            NodeAssert.strictEqual(inspectResult[0].replace(/\s/g, ''), 'Type:TOTP');
            NodeAssert.strictEqual(inspectResult[1].replace(/\s/g, ''), `Key:base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(inspectResult[2].replace(/\s/g, ''), `Label:${label}`);
            NodeAssert.strictEqual(inspectResult[3].replace(/\s/g, ''), `Issuer:${issuer || 'N/A'}`);
            NodeAssert.strictEqual(inspectResult[4].replace(/\s/g, ''), `Period:${period || 30}`);
            NodeAssert.strictEqual(inspectResult[5].replace(/\s/g, ''), `Digits:${digits || 6}`);
            NodeAssert.strictEqual(inspectResult[6].replace(/\s/g, ''), `Digest:${digest || 'SHA1'}`);

            NodeAssert.strictEqual(inspectExitCode, 0);

            const [inspectJsonResult, inspectJsonExitCode] = new OtpCLI().process([
                '-a', 'inspect-url',
                '-u', url,
                '-V', '-j',
            ]);

            NodeAssert.strictEqual(inspectJsonExitCode, 0);
            const obj = JSON.parse(inspectJsonResult.join('\n'));

            NodeAssert.deepStrictEqual(obj, {
                type: 'totp',
                key: LibBase32.stringToBase32(TEST_KEY_RAW),
                label,
                issuer: issuer || null,
                period: period || 30,
                digits: digits || 6,
                digest: digest || LibOTP.Constants.EDigest.SHA1,
            });
        }

        for (const { digest, digits, label, issuer, sequence } of [
            { digest: '', digits: 0, label: 'Test1', issuer: '', sequence: 0 },
            { digest: LibOTP.Constants.EDigest.SHA1, digits: 6, label: 'Test2', issuer: '', sequence: 0 },
            { digest: LibOTP.Constants.EDigest.SHA256, digits: 8, label: 'Test3', issuer: 'Hello', sequence: 123 },
        ]) {

            const url = LibOTP.URL.stringify({
                type: 'hotp',
                key: Buffer.from(TEST_KEY_RAW),
                label,
                issuer: issuer || null,
                digest: (digest || undefined) as LibOTP.Constants.EDigest.SHA1,
                digits: digits || undefined,
                sequence: sequence || undefined,
            });

            const [inspectResult, inspectExitCode] = new OtpCLI().process([
                '-a', 'inspect-url',
                '-u', url,
                '-V',
            ]);

            NodeAssert.strictEqual(inspectExitCode, 0);
            NodeAssert.strictEqual(inspectResult[0].replace(/\s/g, ''), 'Type:HOTP');
            NodeAssert.strictEqual(inspectResult[1].replace(/\s/g, ''), `Key:base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`);
            NodeAssert.strictEqual(inspectResult[2].replace(/\s/g, ''), `Label:${label}`);
            NodeAssert.strictEqual(inspectResult[3].replace(/\s/g, ''), `Issuer:${issuer || 'N/A'}`);
            NodeAssert.strictEqual(inspectResult[4].replace(/\s/g, ''), `Digits:${digits || 6}`);
            NodeAssert.strictEqual(inspectResult[5].replace(/\s/g, ''), `Digest:${digest || 'SHA1'}`);
            NodeAssert.strictEqual(inspectResult[6].replace(/\s/g, ''), `Sequence:${sequence || 1}`);

            const [inspectJsonResult, inspectJsonExitCode] = new OtpCLI().process([
                '-a', 'inspect-url',
                '-u', url,
                '-V', '-j',
            ]);

            NodeAssert.strictEqual(inspectJsonExitCode, 0);
            const obj = JSON.parse(inspectJsonResult.join('\n'));

            NodeAssert.deepStrictEqual(obj, {
                type: 'hotp',
                key: LibBase32.stringToBase32(TEST_KEY_RAW),
                label,
                issuer: issuer || null,
                digits: digits || 6,
                digest: digest || LibOTP.Constants.EDigest.SHA1,
                sequence: sequence || 1,
            });
        }

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-a', 'inspect-url',
                '-u', 'https://www.google.com',
            ]),
            [ [`Error: Invalid URL "https://www.google.com". It must be a valid OTP URL.`], -1 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-a', 'inspect-url',
            ]),
            [ [`Error: The --url option is required for the inspect-url action.`], -1 ],
        );
    });

    NodeTest.it('Test invalid TOTP url', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-u', 'https://www.google.com',
                '-T', '12345',
            ]),
            [ [`Error: Invalid URL "https://www.google.com". It must be a valid OTP URL.`], -1 ],
        );
        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-u', 'otpauth://hotp/d',
                '-T', '12345',
            ]),
            [ [`Error: Invalid URL "otpauth://hotp/d". It must be a valid HOTP URL.`], -1 ],
        );
        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-u', 'otpauth://totp/d',
                '-S', '12345',
            ]),
            [ [`Error: Invalid URL "otpauth://totp/d". It must be a valid TOTP URL.`], -1 ],
        );
    });

    NodeTest.it('Test invalid OTP type', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-k', 'raw:12345678',
                '-T', '12345',
                '-t', 'shit'
            ]),
            [ [`Error: Invalid type "shit", Only "totp" and "hotp" are supported.`], -1 ],
        );
    });

    NodeTest.it('Test invalid action', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process([
                '-k', 'raw:12345678',
                '-T', '12345',
                '-a', 'shit'
            ]),
            [ [`Error: Invalid action "shit", check the help message by --help or -h.`], -1 ],
        );
    });

    NodeTest.it('Test different forms of input key', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `raw:${TEST_KEY_RAW}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `base64:${Buffer.from(TEST_KEY_RAW).toString('base64')}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `hex:${Buffer.from(TEST_KEY_RAW).toString('hex')}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `base32:${LibBase32.stringToBase32(TEST_KEY_RAW)}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `${LibBase32.stringToBase32(TEST_KEY_RAW)}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        const TMP_KEY_FILE_PATH = `${__dirname}/../test-data/tmp.key`;

        NodeFS.writeFileSync(TMP_KEY_FILE_PATH, TEST_KEY_RAW);
        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `file:${TMP_KEY_FILE_PATH}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeFS.writeFileSync(TMP_KEY_FILE_PATH, Buffer.from(TEST_KEY_RAW).toString('base64'));
        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `base64-file:${TMP_KEY_FILE_PATH}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeFS.writeFileSync(TMP_KEY_FILE_PATH, Buffer.from(TEST_KEY_RAW).toString('hex'));
        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `hex-file:${TMP_KEY_FILE_PATH}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeFS.writeFileSync(TMP_KEY_FILE_PATH, LibBase32.stringToBase32(TEST_KEY_RAW));
        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `base32-file:${TMP_KEY_FILE_PATH}`]),
            [ [LibOTP.TOTP.generate(Buffer.from(TEST_KEY_RAW))], 0 ],
        );

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-k', `12345678`]),
            [ [ 'Error: Invalid key "12345678".' ], -1 ],
        );

    });

    NodeTest.it('Print error message if no key is provided', () => {

        NodeAssert.deepStrictEqual(
            new OtpCLI().process(['-d', '5']),
            [ ['Error: The --key option is required or the provided key is invalid.'], -1 ],
        );
    });

    NodeTest.it('Print application name and version by --version or -v', () => {

        const [[msg1], exitCode1] = new OtpCLI().process(['--version']);
        const [[msg2], exitCode2] = new OtpCLI().process(['-v']);
        NodeAssert.strictEqual(msg1.startsWith('OTP (One-Time Password) CLI Tool/'), true);
        NodeAssert.strictEqual(msg2.startsWith('OTP (One-Time Password) CLI Tool/'), true);
        NodeAssert.strictEqual(exitCode1, 0);
        NodeAssert.strictEqual(exitCode2, 0);
    });

    NodeTest.it('Print help message by --help or -h', () => {

        const [msg1, exitCode1] = new OtpCLI().process(['--help']);
        const [msg2, exitCode2] = new OtpCLI().process(['-h']);
        NodeAssert.strictEqual(msg1.includes('Usage:'), true);
        NodeAssert.strictEqual(msg2.includes('Usage:'), true);
        NodeAssert.strictEqual(exitCode1, 0);
        NodeAssert.strictEqual(exitCode2, 0);
    });

    NodeTest.it('Print help message without any arguments', () => {

        const [msg, exitCode1] = new OtpCLI().process([]);
        NodeAssert.strictEqual(msg.includes('Usage:'), true);
        NodeAssert.strictEqual(exitCode1, 0);
    });

    NodeTest.it('Print help message with unsupported arguments', () => {

        const [msg1, exitCode1] = new OtpCLI().process(['--help1']);
        const [msg2, exitCode2] = new OtpCLI().process(['-w']);
        NodeAssert.strictEqual(msg1.includes('Usage:'), true);
        NodeAssert.strictEqual(msg2.includes('Usage:'), true);
        NodeAssert.strictEqual(exitCode1, -1);
        NodeAssert.strictEqual(exitCode2, -1);
    });
});
