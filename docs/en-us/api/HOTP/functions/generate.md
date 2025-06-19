[Documents for @litert/otp](../../index.md) / [HOTP](../index.md) / generate

# Function: generate()

> **generate**(`key`, `sequence`, `digits`, `digest`): `string`

Defined in: [HOTP.ts:30](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L30)

Generate a OTP code using HOTP algorithm, with the given key and sequence.

> WARNING: Not all authenticator apps support digits other than 6.

## Parameters

### key

The key of TOTP (Buffer or BASE32-encoded string).

`string` | `Buffer`\<`ArrayBufferLike`\>

### sequence

`number`

The sequence of OTP

### digits

`number` = `cL.DEFAULT_DIGITS`

The output width of OTP. [default: 6]

### digest

[`EDigest`](../../Constants/enumerations/EDigest.md) = `cL.DEFAULT_DIGEST`

The digest algorithm used to generate the HOTP code. [default: 'SHA1']

## Returns

`string`
