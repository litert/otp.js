# LiteRT/OTP.js 文档

OTP 是 One-Time Password 的简写，是一种用于生成随机一次性口令的标准算法，其目前有两大类：

- 基于实时时间的 TOTP（Time-based One-Time Password），可参看 [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)
- 基于计数器的 HOTP（HMAC-based One-Time Password），可参看 [RFC 4226](https://datatracker.ietf.org/doc/html/rfc4226)

目前大部分主流的网站使用 TOTP 作为二步验证的标准。

## 目录

1. [快速入门](./chapters/01.quick-start.md)
2. [API 接口说明](./chapters/02.apis.md)
