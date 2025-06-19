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

- TypeScript v3.1.x (Or newer)

## Installation

```sh
npm i @litert/otp --save
```

## Usage

### Use in code

See examples:

- [HOTP](./src/examples/hotp.ts)
- [TOTP](./src/examples/totp.ts)

Click [here](./docs/en-us/quick-start.md) for a quick start guide.

### Use as a command line tool

```sh
npm i -g @litert/otp
# or install in local project only
npm i @litert/otp # -D # if only used in dev environment
```

Then you can generate TOTP codes

```sh
npx otp -k 'raw:1234567890'
```

Click [here](./docs/en-us/cli-usage.md) for more details about the CLI usage.

## Documents

- [en-US](https://litert.org/projects/otp.js/)

## License

This library is published under [Apache-2.0](./LICENSE) license.
