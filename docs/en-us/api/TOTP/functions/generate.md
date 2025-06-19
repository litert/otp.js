[Documents for @litert/otp](../../index.md) / [TOTP](../index.md) / generate

# Function: generate()

> **generate**(`key`, `time`, `digits`, `period`, `digest`): `string`

Defined in: [TOTP.ts:36](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L36)

Calculate the OTP code using TOTP algorithm.

> NOTES:
> - Not all authenticator apps support digits other than 6.
> - Not all authenticator apps support SHA256 or SHA512.
> - Not all authenticator apps support period other than 30 seconds.

## Parameters

### key

The key of TOTP (Buffer or BASE32-encoded string).

`string` | `Buffer`\<`ArrayBufferLike`\>

### time

`number` = `...`

The current time in milliseconds. [default: Date.now()]

### digits

`number` = `cL.DEFAULT_DIGITS`

The output width of OTP [default: 6].

### period

`number` = `cL.DEFAULT_PERIOD`

The code generation interval of TOTP, in second. [default: 30]

### digest

[`EDigest`](../../Constants/enumerations/EDigest.md) = `cL.DEFAULT_DIGEST`

The digest algorithm used to generate the TOTP code. [default: 'SHA1']

## Returns

`string`

The generated OTP code.
