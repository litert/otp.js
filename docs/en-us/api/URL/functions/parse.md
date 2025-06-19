[Documents for @litert/otp](../../index.md) / [URL](../index.md) / parse

# Function: parse()

> **parse**(`url`): [`IUrlInfoForHOTP`](../interfaces/IUrlInfoForHOTP.md) \| [`IUrlInfoForTOTP`](../interfaces/IUrlInfoForTOTP.md)

Defined in: [URL.ts:170](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L170)

Parse a OTP URL into structure.

## Parameters

### url

`string`

The OTP url.

## Returns

[`IUrlInfoForHOTP`](../interfaces/IUrlInfoForHOTP.md) \| [`IUrlInfoForTOTP`](../interfaces/IUrlInfoForTOTP.md)

The parsed OTP url info.

## Throws

SyntaxError if the URL is invalid.
