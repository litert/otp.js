[Documents for @litert/otp](../../index.md) / [URL](../index.md) / IUrlInfo

# Interface: IUrlInfo

Defined in: [URL.ts:24](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L24)

## Extended by

- [`IUrlInfoForHOTP`](IUrlInfoForHOTP.md)
- [`IUrlInfoForTOTP`](IUrlInfoForTOTP.md)

## Properties

### betterCompatibility?

> `optional` **betterCompatibility**: `boolean`

Defined in: [URL.ts:31](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L31)

Do not escape '=' in the key/secret, to improve compatibility with some authenticator apps.

#### Default

```ts
false
```

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

***

### issuer?

> `optional` **issuer**: `null` \| `string`

Defined in: [URL.ts:66](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L66)

The issuer of OTP code to display in OTP authenticator app.

***

### key

> **key**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [URL.ts:40](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L40)

The key of OTP code.

If the key is a string, it must be BASE32-encoded.

#### See

https://datatracker.ietf.org/doc/html/rfc4226#section-5.1

***

### label

> **label**: `string`

Defined in: [URL.ts:61](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L61)

The label of OTP code to display in OTP authenticator app.

***

### type

> **type**: `"hotp"` \| `"totp"`

Defined in: [URL.ts:45](https://github.com/litert/otp.js/blob/master/src/lib/URL.ts#L45)

The type of OTP.
