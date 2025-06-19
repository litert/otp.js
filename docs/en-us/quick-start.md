# Quick Start

The basic usage of the `@litert/otp` library is very simple, let's get started with some examples.

## Generate TOTP

TOTP is the most commonly used OTP algorithm, and it is widely supported by various OTP authenticator tools.

See [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) for more details.

### Import the `@litert/otp` library:

```ts
import * as LibOTP from '@litert/otp';
```

### Usage 1: Calculate the TOTP Code directly with a given key

> Note:
> - The OTP generation process must have a (secret) key to distinguish different users.

```ts
const TEST_KEY = Buffer.from('12345678');

// TEST_KEY must be a Buffer or a BASE32-encoded string.
// To get a BASE32-encoded string, you can use the `@litert/base32` module encode/decode it
console.log(LibOTP.TOTP.generate(TEST_KEY));

// Generate TOTP code for a specific timestamp
console.log(LibOTP.TOTP.generate(TEST_KEY, Date.parse('2000-01-01T00:00:00Z')));

// Generate TOTP code with 9 digits
// The digits parameter can be set to 4 ~ 10 digits.
console.log(LibOTP.TOTP.generate(TEST_KEY, Date.parse('2000-01-01T00:00:00Z'), 9));

// Generate TOTP code with a custom period (default is 30 seconds)
console.log(
    LibOTP.TOTP.generate(TEST_KEY, Date.parse('2000-01-01T00:00:00Z'), 6, 60),
);

// Generate TOTP code with a custom digest algorithm (default is SHA-1)
console.log(
    LibOTP.TOTP.generate(
        TEST_KEY,
        Date.parse('2000-01-01T00:00:00Z'),
        6,
        30,
        LibOTP.Constants.EDigest.SHA256
    ),
);
```

### Usage 2: Create a TOTP generator function

Create a generator function with a specific key and some preferences.

```ts
const fnGen1 = TOTP.createGenerator(TEST_KEY);

console.log(fnGen1());

// or with specific timestamp
console.log(fnGen1(Date.parse('2000-01-01T00:00:00Z')));
```

### Usage 3: Generate TOTP URL for OTP Authenticator Tools

```ts
const url = LibOTP.URL.stringify({
    'type': 'totp',
    'key': TEST_KEY,
    'label': 'i@example.org', // The label is usually the user's email or username
    'issuer': 'LiteRT.ORG', // The issuer is usually the name of your application or service
    // digits: 6, // Optional, default is 6
    // period: 30, // Optional, default is 30 seconds
    // digest: LibOTP.Constants.EDigest.SHA1, // Optional, default is SHA-1
    // betterCompatibility: true, // Optional, default is false
});

console.log(url);
```

> This URL is typically used to generate a QR code for OTP tools to scan.

### Usage 4: Using TOTP URL

```ts
const urlInfo = LibOTP.URL.parse(url);

if (urlInfo.type !== 'totp') {

    throw new Error('Not a TOTP URL');
}

console.log(LibOTP.TOTP.generate(
    urlInfo.key,
    Date.parse('2000-01-01T00:00:00Z'),
    urlInfo.digits,
    urlInfo.period,
    urlInfo.digest,
));

const fnGen2 = TOTP.createGenerator(
    urlInfo.key,
    urlInfo.digits,
    urlInfo.period,
    urlInfo.digest,
);
```

That's it! You can now generate TOTP codes and use them in your application.

## What's next?

Here are also supports for [HOTP](https://datatracker.ietf.org/doc/html/rfc4226) (HMAC-based One-Time Password) algorithm. Its usage is similar to TOTP, the only differences are:

- Use the `HOTP` namespace instead of `TOTP`
- Use `sequence` instead of `timestamp`
- No `period` parameter, as HOTP is not time-based

## API Documentation

Click [here](https://litert.org/projects/otp.js/api-docs/) to check the API documentation.
