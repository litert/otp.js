# LiteRT/OTP

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/otp.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/otp "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/otp.svg?maxAge=2592000?style=plastic)](https://github.com/litert/otp/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/litert/otp.js.svg)](https://github.com/litert/otp.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/otp.js.svg)](https://github.com/litert/otp.js/releases "Stable Release")

The TOTP & HOTP implement for Node.JS.

## Features

- [x] HOTP (HMAC-based One-Time Password) algorithm implementation.
- [x] TOTP (Time-based One-Time Password) algorithm implementation.
- [x] OTP URL encoding and decoding.
- [x] Command line tool:
    - [x] Generating OTP codes.
    - [x] Generating OTP URLs.
    - [x] Inspecting OTP URLs.
- [x] Customization:
    - [x] Digits length from 4 - 10
    - [x] TOTP time-step (period)
    - [x] Digest algorithms including SHA-1, SHA-256, and SHA-512

## Requirements

- Node.js >= 20.0.0
- TypeScript v5.0.x (Or newer)

> This package is an ES module (ESM). Your project must use ESM (`"type": "module"`) or be configured for ESM compatibility.

## Installation

```sh
npm i @litert/otp --save
```

## Usage

### Use in code

#### Namespace import (recommended)

```ts
import * as LibOTP from '@litert/otp';

// TOTP
const code = LibOTP.TOTP.generate(Buffer.from('12345678901234567890'));
const gen = LibOTP.TOTP.createGenerator(Buffer.from('12345678901234567890'));
console.log(gen());

// HOTP
const hotpCode = LibOTP.HOTP.generate(Buffer.from('12345678901234567890'), 0);

// URL
const url = LibOTP.URL.stringify({
    type: 'totp',
    key: Buffer.from('12345678901234567890'),
    label: 'user@example.com',
});
const info = LibOTP.URL.parse(url);
```

#### Subpath imports (tree-shakable)

You can also import individual modules via subpath exports:

```ts
import { generate } from '@litert/otp/totp';
import { generate as generateHOTP, createGenerator } from '@litert/otp/hotp';
import { stringify, parse } from '@litert/otp/url';
import { EDigest, DEFAULT_DIGITS } from '@litert/otp/constants';
import { generate as generateVerboseTOTP } from '@litert/otp/totp/verbose';
import { generate as generateVerboseHOTP } from '@litert/otp/hotp/verbose';
```

See full examples:

- [HOTP](./src/examples/hotp.ts)
- [TOTP](./src/examples/totp.ts)

Click [here](./docs/en-us/quick-start.md) for a quick start guide.

### Use as a command line tool

You can use this library as a command line tool to do OTP operations.

There are two ways to use the CLI:

1. Use `npx` to run the CLI without installing it manually.

    ```sh
    npx @litert/otp -k 'raw:1234567890'

    # Check the help message
    npx @litert/otp --help
    ```

2. Install it globally or locally in your project.

    ```sh
    npm i -g @litert/otp
    # or install in local project only
    npm i @litert/otp # -D # if only used in dev environment
    ```

    Then you can use the `otp` command directly:

    ```sh
    npx otp -k 'raw:1234567890'
    ```

Click [here](./docs/en-us/cli-usage.md) for more details about the CLI usage.

## Documents

- [en-US](https://litert.org/projects/otp.js/)

## License

This library is published under [Apache-2.0](./LICENSE) license.
