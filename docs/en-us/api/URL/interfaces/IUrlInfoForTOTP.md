[Documents for @litert/otp](../../index.md) / [URL](../index.md) / IUrlInfoForTOTP

# Interface: IUrlInfoForTOTP

Defined in: [URL.ts:94](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L94)

## Extends

- [`IUrlInfo`](IUrlInfo.md)

## Properties

### betterCompatibility?

> `optional` **betterCompatibility**: `boolean`

Defined in: [URL.ts:31](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L31)

Do not escape '=' in the key/secret, to improve compatibility with some authenticator apps.

#### Default

```ts
false
```

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`betterCompatibility`](IUrlInfo.md#bettercompatibility)

***

### digest?

> `optional` **digest**: [`EDigest`](../../Constants/enumerations/EDigest.md)

Defined in: [URL.ts:78](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L78)

The digest algorithm used to generate the OTP code.

#### Warning

Not all authenticator apps support SHA256 or SHA512.

#### Default

```ts
'SHA1'
```

#### See

 - https://datatracker.ietf.org/doc/html/rfc4226#section-5
 - https://datatracker.ietf.org/doc/html/rfc6238#section-1.2

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`digest`](IUrlInfo.md#digest)

***

### digits?

> `optional` **digits**: `number`

Defined in: [URL.ts:56](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L56)

The output width of OTP.

#### Default

```ts
6
```

#### Warning

Not all authenticator apps support digits other than 6.

#### See

https://datatracker.ietf.org/doc/html/rfc4226#section-5

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`digits`](IUrlInfo.md#digits)

***

### issuer?

> `optional` **issuer**: `null` \| `string`

Defined in: [URL.ts:66](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L66)

The issuer of OTP code to display in OTP authenticator app.

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`issuer`](IUrlInfo.md#issuer)

***

### key

> **key**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [URL.ts:40](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L40)

The key of OTP code.

If the key is a string, it must be BASE32-encoded.

#### See

https://datatracker.ietf.org/doc/html/rfc4226#section-5.1

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`key`](IUrlInfo.md#key)

***

### label

> **label**: `string`

Defined in: [URL.ts:61](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L61)

The label of OTP code to display in OTP authenticator app.

#### Inherited from

[`IUrlInfo`](IUrlInfo.md).[`label`](IUrlInfo.md#label)

***

### period?

> `optional` **period**: `number`

Defined in: [URL.ts:107](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L107)

The interval of every TOTP code, in seconds.

#### Default

```ts
30
```

#### Warning

Not all authenticator apps support period other than 30 seconds.

#### See

https://datatracker.ietf.org/doc/html/rfc6238#section-4.1

***

### type

> **type**: `"totp"`

Defined in: [URL.ts:96](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L96)

The type of OTP.

#### Overrides

[`IUrlInfo`](IUrlInfo.md).[`type`](IUrlInfo.md#type)
