[Documents for @litert/otp](../../index.md) / [TOTP](../index.md) / IGenerator

# Interface: IGenerator()

Defined in: [TOTP.ts:54](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L54)

Generator function type for TOTP codes.

> **IGenerator**(`time?`): `string`

Defined in: [TOTP.ts:76](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L76)

Generator function type for TOTP codes.

## Parameters

### time?

`number`

The current time in milliseconds. [default: Date.now()]

## Returns

`string`

## Properties

### digest

> `readonly` **digest**: [`EDigest`](../../Constants/enumerations/EDigest.md)

Defined in: [TOTP.ts:69](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L69)

The digest algorithm used to generate the TOTP code.

***

### digits

> `readonly` **digits**: `number`

Defined in: [TOTP.ts:59](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L59)

The output width of OTP.

***

### period

> `readonly` **period**: `number`

Defined in: [TOTP.ts:64](https://github.com/litert/otp.js/blob/master/src/lib/TOTP.ts#L64)

The code generation interval of TOTP, in second.
