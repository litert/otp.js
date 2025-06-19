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

import * as NodeUtils from 'node:util';
import * as NodeFS from 'node:fs';
import * as Base32 from '@litert/base32';
import * as LibOtp from '../lib';
import type { IVerboseResult  } from '../lib/verbose/_internal';
import { EDigest } from '../lib/Constants';

/**
 * The action for the CLI tool.
 */
export enum EAction {
    INSPECT_URL = 'inspect-url',
    GENERATE_URL = 'gen-url',
    GENERATE_CODE = 'code',
}

interface ICmdLineArgs {

    values: {
        action: string;
        type: string;
        help: boolean;
        url?: string;
        key?: string;
        time: string;
        sequence: string;
        digits: string;
        period: string;
        verbose: boolean;
        version: boolean;
        digest: string;
        label?: string;
        issuer?: string;
        'json-output': boolean;
        'compatible-url': boolean;
    };
    positionals: [];
}

class ErrorPrintOutputBuffer extends Error {}
class ErrorPrintMessage extends Error {}

export class OtpCLI {

    private readonly _ob: string[] = [];

    private _printVersionMessage() {

        this._ob.push(`OTP (One-Time Password) CLI Tool/${require('../package.json').version} (https://github.com/litert/otp.js)`);
    }

    private _printHelpMessage(): void {

        this._printVersionMessage();

        this._ob.push(
            ``,
            `Usage:`,
            ``,
            `  # Generate a TOTP code`,
            `  otp [--action ${EAction.GENERATE_CODE}] --type totp --key <key> [--time <timestamp>] [--digits <digits>] [--period <period>]`,
            ``,
            `  # Generate a TOTP code from a URL`,
            `  otp [--action ${EAction.GENERATE_CODE}] --type totp --url <url> [--time <timestamp>]`,
            ``,
            `  # Generate a HOTP code`,
            `  otp [--action ${EAction.GENERATE_CODE}] --type hotp --key <key> [--sequence <sequence>] [--digits <digits>]`,
            ``,
            `  # Generate a HOTP code from a URL`,
            `  otp [--action ${EAction.GENERATE_CODE}] --type hotp --url <url> [--sequence <sequence>]`,
            ``,
            `  # Generate a TOTP URL for OTP authenticator app`,
            `  otp --action ${EAction.GENERATE_URL} [--type totp] --key <key> --label <label> [--issuer <issuer>] [--period <period>] [--digits <digits>]`,
            ``,
            `  # Generate a HOTP URL for OTP authenticator app`,
            `  otp --action ${EAction.GENERATE_URL} [--type hotp] --key <key> --label <label> [--issuer <issuer>] [--sequence <base-sequence>] [--digits <digits>]`,
            ``,
            `  # Parse a OTP URL and display the information`,
            `  otp --action ${EAction.INSPECT_URL} --url <url>`,
            ``,
            `Options:`,
            ``,
            `  --action, -a        The action to perform. [default: code]`,
            `  --type, -t          The type of OTP to generate. [default: totp]`,
            `  --key, -k           The key for generating the OTP code, in below formats`,
            `                        hex:<hex string>`,
            `                        hex-file:<path to hex file>`,
            `                        base64:<base64 string>`,
            `                        base64-file:<path to base64 file>`,
            `                        raw:<raw characters>`,
            `                        file:<path to raw file>`,
            `                        base32:<base32 string>`,
            `                        base32-file:<path to base32 file>`,
            `                        <base32 string> (default, will be treated as base32)`,
            `  --url, -u           The OTP URL to parse or generate the code from.`,
            `  --time, -T          The timestamp to use for TOTP code generation. [default: current time]`,
            `  --sequence, -S      The sequence number for HOTP code generation. [default: 1]`,
            `  --digits, -d        The number of digits in the generated OTP code. [default: 6]`,
            `  --digest, -D        The hash algorithm to use for TOTP code generation. [default: SHA1]`,
            `  --period, -p        The period in seconds for TOTP code generation. [default: 30]`,
            `  --label, -L         The label for the OTP URL. [required for gen-url actions]`,
            `  --issuer, -I        The issuer for the OTP URL. [optional]`,
            `  --json-output, -j   Output the inspection result in JSON format.`,
            `  --verbose, -V       Output the details about the OTP.`,
            `  --compatible-url    Generate the URL with better compatibility for some OTP apps.`,
            `  --version, -v       Show the version of the tool.`,
            `  --help, -h          Show this help message and exit.`,
        );
    }

    private _parseCLArgs(): ICmdLineArgs {

        try {

            return NodeUtils.parseArgs({
                'options': {
                    'action': {
                        'type': 'string',
                        'short': 'a',
                        'default': 'code',
                    },
                    'type': {
                        'type': 'string',
                        'short': 't',
                        'default': 'totp',
                    },
                    'help': {
                        'type': 'boolean',
                        'short': 'h',
                        'default': false,
                    },
                    'compatible-url': {
                        'type': 'boolean',
                        'default': false,
                    },
                    'url': {
                        'type': 'string',
                        'short': 'u',
                    },
                    'key': {
                        'type': 'string',
                        'short': 'k',
                    },
                    'time': {
                        'type': 'string',
                        'short': 'T',
                        'default': Math.floor(Date.now() / 1000).toString(),
                    },
                    'sequence': {
                        'type': 'string',
                        'short': 'S',
                        'default': '1',
                    },
                    'digits': {
                        'type': 'string',
                        'short': 'd',
                        'default': '6',
                    },
                    'period': {
                        'type': 'string',
                        'short': 'p',
                        'default': '30',
                    },
                    'verbose': {
                        'type': 'boolean',
                        'short': 'V',
                        'default': false,
                    },
                    'version': {
                        'type': 'boolean',
                        'short': 'v',
                        'default': false,
                    },
                    'digest': {
                        'type': 'string',
                        'short': 'D',
                        'default': 'SHA1',
                    },
                    'label': {
                        'type': 'string',
                        'short': 'L',
                    },
                    'issuer': {
                        'type': 'string',
                        'short': 'I',
                    },
                    'json-output': {
                        'type': 'boolean',
                        'short': 'j',
                        'default': false,
                    },
                },
            });
        }
        catch {

            this._printHelpMessage();
            throw new ErrorPrintOutputBuffer();
        }
    }

    private _generateTotpCodeByURL(clArgs: ICmdLineArgs) {

        const urlInfo = this._parseTotpUrl(clArgs);

        const time = this._parseTime(clArgs.values.time);

        if (!clArgs.values.verbose) {

            this._ob.push(LibOtp.TOTP.generate(urlInfo.key, time, urlInfo.digits, urlInfo.period, urlInfo.digest));
            return;
        }

        this._generateVerboseTotpCode(
            urlInfo.key as Buffer,
            time,
            urlInfo.digits!,
            urlInfo.period!,
            urlInfo.digest!,
            clArgs.values['json-output'],
        );
    }

    private _parseTotpUrl(clArgs: ICmdLineArgs): LibOtp.URL.IUrlInfoForTOTP {

        try {

            return LibOtp.URL.parse(clArgs.values.url!) as LibOtp.URL.IUrlInfoForTOTP;
        }
        catch {

            throw new ErrorPrintMessage(`Invalid URL "${clArgs.values.url!}". It must be a valid TOTP URL`);
        }
    }

    private _parseHotpUrl(clArgs: ICmdLineArgs): LibOtp.URL.IUrlInfoForHOTP {

        try {

            return LibOtp.URL.parse(clArgs.values.url!) as LibOtp.URL.IUrlInfoForHOTP;
        }
        catch {

            throw new ErrorPrintMessage(`Invalid URL "${clArgs.values.url!}". It must be a valid HOTP URL`);
        }
    }

    private _generateVerboseTotpCode(
        key: Buffer,
        time: number,
        digits: number,
        period: number,
        digest: EDigest,
        outputAsJson: boolean,

    ) {

        const vResult: IVerboseResult = require('../lib/verbose/TOTP').generate(key, time, digits, period, digest);

        if (outputAsJson) {

            this._ob.push(JSON.stringify({
                code: vResult.code,
                key: Base32.bufferToBase32(key),
                time: new Date(time).toISOString(),
                period,
                digits: vResult.digits,
                digest: vResult.digest,
                hmac: vResult.hmac.toString('hex'),
                bitOffset: vResult.bitOffset,
                fullCode: vResult.fullCode,
                sequence: vResult.sequence,
            }, null, 2));
            return;
        }

        this._ob.push(`TOTP Code:  ${vResult.code}`);
        this._ob.push(`Key:        base32:${Base32.bufferToBase32(key)}`);
        this._ob.push(`Time:       ${new Date(time).toISOString()}`);
        this._ob.push(`Period:     ${period} seconds`);
        this._ob.push(`Digits:     ${vResult.digits}`);
        this._ob.push(`Digest:     ${vResult.digest}`);
        this._ob.push(`Sequence:   ${vResult.sequence}`);
        this._ob.push(`HMAC:       hex:${vResult.hmac.toString('hex')}`);
        this._ob.push(`Bit Offset: ${vResult.bitOffset}`);
        this._ob.push(`Full Code:  ${vResult.fullCode}`);
    }

    private _generateTotpCode(clArgs: ICmdLineArgs) {

        const key = this._parseKey(clArgs.values.key);
        const digits = this._parseDigits(clArgs.values.digits);
        const digest = this._parseDigest(clArgs.values.digest);
        const period = this._parsePeriod(clArgs.values.period);
        const time = this._parseTime(clArgs.values.time);

        if (!clArgs.values.verbose) {

            this._ob.push(LibOtp.TOTP.generate(key, time, digits, period, digest));
            return;
        }

       this._generateVerboseTotpCode(key, time, digits, period, digest, clArgs.values['json-output']);
    }

    private _inspectUrl(clArgs: ICmdLineArgs) {

        if (!clArgs.values.url) {

            throw new ErrorPrintMessage(`The --url option is required for the ${EAction.INSPECT_URL} action`);
        }

        let urlInfo: LibOtp.URL.IUrlInfoForHOTP | LibOtp.URL.IUrlInfoForTOTP;

        try {

            urlInfo = LibOtp.URL.parse(clArgs.values.url);
        }
        catch (err) {

            throw new ErrorPrintMessage(`Invalid URL "${clArgs.values.url!}". It must be a valid OTP URL`);
        }

        if (clArgs.values['json-output']) {

            this._ob.push(JSON.stringify({
                ...urlInfo,
                key: Base32.bufferToBase32(urlInfo.key as Buffer),
            }, null, 2));
            return;
        }
        else if (urlInfo.type === 'totp') {

            this._ob.push(`Type:       TOTP`);
            this._ob.push(`Key:        base32:${Base32.bufferToBase32(urlInfo.key as Buffer)}`);
            this._ob.push(`Label:      ${urlInfo.label}`);
            this._ob.push(`Issuer:     ${urlInfo.issuer ?? 'N/A'}`);
            this._ob.push(`Period:     ${urlInfo.period}`);
            this._ob.push(`Digits:     ${urlInfo.digits}`);
            this._ob.push(`Digest:     ${urlInfo.digest}`);
        }
        else {

            this._ob.push(`Type:       HOTP`);
            this._ob.push(`Key:        base32:${Base32.bufferToBase32(urlInfo.key as Buffer)}`);
            this._ob.push(`Label:      ${urlInfo.label}`);
            this._ob.push(`Issuer:     ${urlInfo.issuer ?? 'N/A'}`);
            this._ob.push(`Digits:     ${urlInfo.digits}`);
            this._ob.push(`Digest:     ${urlInfo.digest}`);
            this._ob.push(`Sequence:   ${urlInfo.sequence}`);
        }
    }

    private _generateHotpCode(clArgs: ICmdLineArgs): void {

        const key = this._parseKey(clArgs.values.key);
        const digits = this._parseDigits(clArgs.values.digits);
        const digest = this._parseDigest(clArgs.values.digest);

        const seq = this._parseSequence(clArgs.values.sequence);

        if (!clArgs.values.verbose) {

            this._ob.push(LibOtp.HOTP.generate(key, seq, digits, digest));
            return;
        }

        this._generateVerboseHotpCode(key, seq, digits, digest, clArgs.values['json-output']);
    }

    private _generateHotpCodeByURL(clArgs: ICmdLineArgs): void {

        const urlInfo = this._parseHotpUrl(clArgs);

        const seq = this._parseSequence(clArgs.values.sequence);

        if (!clArgs.values.verbose) {

            this._ob.push(LibOtp.HOTP.generate(urlInfo.key, seq, urlInfo.digits, urlInfo.digest));
            return;
        }

        this._generateVerboseHotpCode(
            urlInfo.key as Buffer,
            seq,
            urlInfo.digits!,
            urlInfo.digest!,
            clArgs.values['json-output'],
        );
    }

    private _generateVerboseHotpCode(
        key: Buffer,
        sequence: number,
        digits: number,
        digest: EDigest,
        outputAsJson: boolean,
    ): void {

        const vResult: IVerboseResult = require('../lib/verbose/HOTP').generate(key, sequence, digits, digest);

        if (outputAsJson) {

            this._ob.push(JSON.stringify({
                code: vResult.code,
                key: Base32.bufferToBase32(key),
                time: new Date().toISOString(),
                digits: vResult.digits,
                digest: vResult.digest,
                sequence: vResult.sequence,
                hmac: vResult.hmac.toString('hex'),
                bitOffset: vResult.bitOffset,
                fullCode: vResult.fullCode,
            }, null, 2));
            return;
        }

        this._ob.push(`HOTP Code:  ${vResult.code}`);
        this._ob.push(`Key:        base32:${Base32.bufferToBase32(key)}`);
        this._ob.push(`Digits:     ${vResult.digits}`);
        this._ob.push(`Digest:     ${vResult.digest}`);
        this._ob.push(`Sequence:   ${vResult.sequence}`);
        this._ob.push(`HMAC:       hex:${vResult.hmac.toString('hex')}`);
        this._ob.push(`Bit Offset: ${vResult.bitOffset}`);
        this._ob.push(`Full Code:  ${vResult.fullCode}`);
    }

    private _parseSequence(sequence: string): number {
        if (!/^\d+$/.test(sequence)) {
            throw new ErrorPrintMessage(`Invalid sequence "${sequence}". It must be a non-negative integer`);
        }
        const ret = parseInt(sequence, 10);
        if (!Number.isSafeInteger(ret) || ret < 0) {
            throw new ErrorPrintMessage(`Invalid sequence "${sequence}". It must be a non-negative integer`);
        }
        return ret;
    }

    private _parseTime(timeArg: string): number {

        if (/^\d+$/.test(timeArg)) {

            const ret = parseInt(timeArg, 10) * 1000;

            if (!Number.isSafeInteger(ret) || ret < 0) {
                throw new ErrorPrintMessage(`Invalid time "${timeArg}". It must be a valid UNIX timestamp or date string`);
            }

            return ret;
        }
        else {

            try {
                const ret = Date.parse(timeArg);

                if (isNaN(ret)) {

                    throw new ErrorPrintMessage(`Invalid time "${timeArg}". It must be a valid UNIX timestamp or date string`);
                }

                return ret;
            }
            catch {

                throw new ErrorPrintMessage(`Invalid time "${timeArg}". It must be a valid UNIX timestamp or date string`);
            }
        }
    }

    private _parseDigits(digits: string) {

        const ret = parseInt(digits, 10);

        if (!Number.isSafeInteger(ret) || ret < 4 || ret > 10) {
            throw new ErrorPrintMessage(`Invalid digits length "${digits}". It must be an integer between 4 and 10`);
        }

        return ret;
    }

    private _parsePeriod(period: string): number {
        if (!/^\d+$/.test(period)) {
            throw new ErrorPrintMessage(`Invalid period "${period}". It must be a positive integer`);
        }
        const ret = parseInt(period, 10);
        if (!Number.isSafeInteger(ret) || ret <= 0) {
            throw new ErrorPrintMessage(`Invalid period "${period}". It must be a positive integer`);
        }
        return ret;
    }

    private _parseDigest(digest: string): EDigest {
        const ret = digest.toUpperCase();
        switch (ret) {
            case 'SHA1':
            case 'SHA256':
            case 'SHA512':
                return ret as EDigest;
            default:
                throw new ErrorPrintMessage(`Invalid digest "${digest}". It must be one of "SHA1", "SHA256", or "SHA512"`);
        }
    }

    private _parseKey(key?: string): Buffer {

        if (!key) {

            throw new ErrorPrintMessage('The --key option is required or the provided key is invalid');
        }

        try {

            if (key.startsWith('base64:')) {
                key = key.slice(7);
                return Buffer.from(key, 'base64');
            }

            if (key.startsWith('base64-file:')) {
                key = key.slice(12);
                return Buffer.from(NodeFS.readFileSync(key, 'utf-8'), 'base64');
            }

            if (key.startsWith('hex:')) {
                key = key.slice(4);
                return Buffer.from(key, 'hex');
            }

            if (key.startsWith('hex-file:')) {
                key = key.slice(9);
                return Buffer.from(NodeFS.readFileSync(key, 'utf-8'), 'hex');
            }

            if (key.startsWith('raw:')) {
                key = key.slice(4);
                return Buffer.from(key, 'utf-8');
            }

            if (key.startsWith('base32-file:')) {
                key = key.slice(12);
                return Base32.bufferFromBase32(NodeFS.readFileSync(key, 'utf-8'));
            }

            if (key.startsWith('file:')) {
                key = key.slice(5);
                return NodeFS.readFileSync(key);
            }

            if (key.startsWith('base32:')) {
                key = key.slice(7);
                return Base32.bufferFromBase32(key);
            }

            return Base32.bufferFromBase32(key);
        }
        catch {

            throw new ErrorPrintMessage(`Invalid key "${key}"`);
        }
    }

    private _generateUrlForTOTP(clArgs: ICmdLineArgs): void {

        const key = this._parseKey(clArgs.values.key);
        const label = clArgs.values.label?.trim();
        const issuer = clArgs.values.issuer?.trim();
        const period = this._parsePeriod(clArgs.values.period);
        const digits = this._parseDigits(clArgs.values.digits);
        const digest = this._parseDigest(clArgs.values.digest);

        if (!label) {

            throw new ErrorPrintMessage('The --label option is required');
        }

        this._ob.push(LibOtp.URL.stringify({
            type: 'totp',
            key,
            label,
            issuer,
            period,
            digits,
            digest,
            betterCompatibility: clArgs.values['compatible-url'],
        }));
    }

    private _generateUrlForHOTP(clArgs: ICmdLineArgs): void {

        const key = this._parseKey(clArgs.values.key);
        const label = clArgs.values.label?.trim();
        const issuer = clArgs.values.issuer?.trim();
        const digits = this._parseDigits(clArgs.values.digits);
        const digest = this._parseDigest(clArgs.values.digest);
        const baseSequence = this._parseSequence(clArgs.values.sequence);

        if (!label) {

            throw new ErrorPrintMessage('The --label option is required');
        }

        this._ob.push(LibOtp.URL.stringify({
            type: 'hotp',
            key,
            label,
            issuer,
            digits,
            digest,
            sequence: baseSequence,
            betterCompatibility: clArgs.values['compatible-url'],
        }));
    }

    private _process(args: string[]): string[] {

        process.argv = [ ...process.argv.slice(0, 2), ...args ];

        if (process.argv.length <= 2) {
            this._printHelpMessage();
            return this._ob;
        }

        const clArgs = this._parseCLArgs();

        if (clArgs.values.help) {
            this._printHelpMessage();
            return this._ob;
        }

        if (clArgs.values.version) {
            this._printVersionMessage();
            return this._ob;
        }

        const type = clArgs.values.type?.toLowerCase().trim();

        if (clArgs.values.action.toLowerCase() !== EAction.INSPECT_URL) {

            switch (clArgs.values.type?.toLowerCase()) {
                case 'totp':
                case 'hotp':
                    break;
                default:
                    throw new ErrorPrintMessage(`Invalid type "${clArgs.values.type}", Only "totp" and "hotp" are supported`);
            }
        }

        switch (clArgs.values.action) {
            case EAction.INSPECT_URL:
                this._inspectUrl(clArgs);
                break;
            case EAction.GENERATE_URL:
                if (type === 'totp') {
                    this._generateUrlForTOTP(clArgs);
                }
                else {
                    this._generateUrlForHOTP(clArgs);
                }
                break;
            case EAction.GENERATE_CODE:
                if (clArgs.values.url) {
                    if (clArgs.values.url.toLowerCase().startsWith('otpauth://totp/')) {
                        this._generateTotpCodeByURL(clArgs);
                    }
                    else if (clArgs.values.url.toLowerCase().startsWith('otpauth://hotp/')) {
                        this._generateHotpCodeByURL(clArgs);
                    }
                    else {
                        throw new ErrorPrintMessage(`Invalid URL "${clArgs.values.url}". It must be a valid OTP URL`);
                    }
                }
                else if (type === 'totp') {
                    this._generateTotpCode(clArgs);
                }
                else /* if (type === 'hotp') */ {
                    this._generateHotpCode(clArgs);
                }
                break;
            default:
                throw new ErrorPrintMessage(`Invalid action "${clArgs.values.action}", check the help message by --help or -h`);
        }

        return this._ob;
    }

    public process(args: string[]): [string[], number] {

        try {

            return [this._process(args), 0];
        }
        catch (e) {

            if (e instanceof ErrorPrintOutputBuffer) {

                return [this._ob, -1];
            }
            else if (e instanceof ErrorPrintMessage) {

                return [[`Error: ${e.message}.`], -1];
            }
            else if (e instanceof Error) {

                return [[`Unexpected Error: ${e.message}`], -1];
            }
            else {

                return [[`Unknown Error: ${e}`], -1];
            }
        }
    }
}
