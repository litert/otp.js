[Documents for @litert/otp](../../index.md) / [TOTP](../index.md) / createGenerator

# Function: createGenerator()

> **createGenerator**(`key`, `digits`, `period`, `digest`): [`IGenerator`](../interfaces/IGenerator.md)

Defined in: [TOTP.ts:96](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L96)

Create a TOTP code generator function using configuration.

> NOTES:
> - Not all authenticator apps support digits other than `6`.
> - Not all authenticator apps support `SHA256` or `SHA512`.
> - Not all authenticator apps support period other than `30` seconds.

## Parameters

### key

The key of TOTP (Buffer or BASE32-encoded string).

`string` | `Buffer`\<`ArrayBufferLike`\>

### digits

`number` = `cL.DEFAULT_DIGITS`

The output width of OTP [default: `6`].

### period

`number` = `cL.DEFAULT_PERIOD`

The code generation interval of TOTP, in second. [default: `30`]

### digest

[`EDigest`](../../Constants/enumerations/EDigest.md) = `cL.DEFAULT_DIGEST`

The digest algorithm used to generate the TOTP code [default: `SHA1`].

## Returns

[`IGenerator`](../interfaces/IGenerator.md)

The TOTP code generator function.

## Throws

If the `key`, `digits`, or `period` is invalid.

## Throws

If the `digits` or `period` is out of range.
