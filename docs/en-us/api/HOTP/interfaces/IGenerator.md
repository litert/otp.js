[Documents for @litert/otp](../../index.md) / [HOTP](../index.md) / IGenerator

# Interface: IGenerator()

Defined in: [HOTP.ts:46](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L46)

Generator function type for HOTP codes.

> **IGenerator**(`seq`): `string`

Defined in: [HOTP.ts:63](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L63)

Generator function type for HOTP codes.

## Parameters

### seq

`number`

The sequence of OTP to generate.

## Returns

`string`

## Properties

### digest

> `readonly` **digest**: [`EDigest`](../../Constants/enumerations/EDigest.md)

Defined in: [HOTP.ts:56](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L56)

The digest algorithm used to generate the TOTP code.

***

### digits

> `readonly` **digits**: `number`

Defined in: [HOTP.ts:51](https://github.com/litert/otp.js/blob/master/src/lib/HOTP.ts#L51)

The output width of OTP.
