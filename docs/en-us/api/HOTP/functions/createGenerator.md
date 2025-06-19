[Documents for @litert/otp](../../index.md) / [HOTP](../index.md) / createGenerator

# Function: createGenerator()

> **createGenerator**(`key`, `digits`, `digest`): [`IGenerator`](../interfaces/IGenerator.md)

Defined in: [HOTP.ts:73](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L73)

Create a HOTP code generator function using configuration.

## Parameters

### key

The key of TOTP (Buffer or BASE32-encoded string).

`string` | `Buffer`\<`ArrayBufferLike`\>

### digits

`number` = `cL.DEFAULT_DIGITS`

The output width of OTP [default: 6].

### digest

[`EDigest`](../../Constants/enumerations/EDigest.md) = `cL.DEFAULT_DIGEST`

The digest algorithm used to generate the HOTP code [default: 'SHA1'].

## Returns

[`IGenerator`](../interfaces/IGenerator.md)
