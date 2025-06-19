[Documents for @litert/otp](../../index.md) / [URL](../index.md) / stringify

# Function: stringify()

> **stringify**(`opts`): `string`

Defined in: [URL.ts:122](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L122)

Generate a OTP URL which could be used to generate QR code, and then read by the OTP authenticator app.

> NOTES:
> - Not all authenticator apps support digits other than 6.
> - Not all authenticator apps support SHA256 or SHA512.
> - Not all authenticator apps support period other than 30 seconds.

## Parameters

### opts

The options for generating the URL.

[`IUrlInfoForHOTP`](../interfaces/IUrlInfoForHOTP.md) | [`IUrlInfoForTOTP`](../interfaces/IUrlInfoForTOTP.md)

## Returns

`string`

The generated OTP URL.
