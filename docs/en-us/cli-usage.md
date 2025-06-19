# OTP CLI Usage

This project provides a command-line interface (CLI) for OTP operations, with below features:

- **Generate TOTP Code**: Generate Time-based One-Time Passwords (TOTP) using a secret key.
- **Generate HOTP Code**: Generate HMAC-based One-Time Passwords (HOTP) using a secret key and counter.
- **Generate TOTP URL**: Generate a URL for TOTP that can be used with OTP authenticator tools.
- **Generate HOTP URL**: Generate a URL for HOTP that can be used with OTP authenticator tools.
- **Inspect OTP URL**: Parse and inspect TOTP or HOTP URLs to details like key, digits, period, and digest.

## Installation

You can install the CLI globally using npm:

```bash
npm install -g @litert/otp

# Or just install it locally in your project:
npm install @litert/otp # -D if you want to use it as a dev dependency
```

## Usage

For the detailed usage, you can run the CLI with the `--help`/`-h` option:

```bash
npx otp --help
```

## Examples

- Generate a HOTP code using a sequence

    To generate a HOTP code, you need to provide a sequence value using the `-S`(`--sequence`) option.

    ```bash
    npx otp -t hotp -k 'raw:1234567890' -S 12345
    ```

- Generate a TOTP code for the current time

    To generate OTP codes, a secret key is always required. It must be passed in with either the `-k`(`--key`) option or the `-u`(`--url`) option.

    ```bash
    npx otp -k 'raw:1234567890'
    ```

    > The default action is `code`, and the default type of OTP is `totp`.
    > So the above command is equivalent to:
    >
    > ```bash
    > npx otp -a code -k 'raw:1234567890' --type totp
    > ```

- Generate a TOTP code for a specific time

    Using the `-T`(`--time`) option, you can specify a timestamp to generate the TOTP code for that specific time.

    ```bash
    npx otp -k 'raw:1234567890' -T '2020-01-01T00:00:00Z'
    ```

- Using custom digits, period, and digest

    Using the `-d`(`--digits`), `-p`(`--period`), and `-D`(`--digest`) options, you can specify the number of digits, the period in seconds, and the digest algorithm to use.

    ```bash
    npx otp -k 'raw:1234567890' -d 8 -p 60 -D sha256
    ```

- Using different key formats

    ```bash
    npx otp -k 'B4PSUNCFJMQCUEBGEEFSYCTD'
    npx otp -k 'base32:B4PSUNCFJMQCUEBGEEFSYCTD'
    npx otp -k 'base64:QkRTVU5DRkZKTVFDUUVCR0VFRlNZQ1RE'
    npx otp -k 'hex:424453554e4346464a4d5143554542474545465349435444'
    npx otp -k 'raw:1234567890'
    npx otp -k 'hex-file:./path/to/otp-key.hex'
    npx otp -k 'base64-file:./path/to/otp-key.b64'
    npx otp -k 'base32-file:./path/to/otp-key.b32'
    npx otp -k 'file:./path/to/otp-key.bin'
    ```

- Generate OTP code using OTP URL instead of key

    Using `--url` or `-u` option, you can pass an OTP URL to generate the OTP code, instead of passing the key, digits, period, and digest separately.

    ```bash
    npx otp -u 'otpauth://totp/Demo?secret=GEZDGNBVGY3TQOJQ&algorithm=SHA1&digits=6&issuer=LiteRT.ORG&period=30'
    ```

- Inspecting a TOTP URL

    The `inspect-url` action could parse the OTP URL, and display its details.

    ```bash
    npx otp \
        -a inspect-url \
        -u 'otpauth://totp/Demo?secret=GEZDGNBVGY3TQOJQ&algorithm=SHA1&digits=6&issuer=LiteRT.ORG&period=30'
    ```

- Generate an OTP URL

    Using the `gen-url` action, you can generate an OTP URL with the specified key, label, issuer, digits, period, and digest.

    ```bash
    npx otp -a gen-url \
        -k 'raw:1234567890' \
        --label 'Demo' \
        --issuer 'LiteRT.ORG' \
        --digits 6 \
        --period 30 \
        --digest sha1
    ```

    > The default type of OTP is `totp`, to generate a HOTP URL, you can use the `--type` option to specify the type as `hotp`.