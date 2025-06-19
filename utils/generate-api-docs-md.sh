#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

API_DOC_OUTPUT_DIR=docs/en-us/api
SRC_DIR=src/lib

rm -rf $API_DOC_OUTPUT_DIR

npx typedoc \
    --exclude "**/*+(index|.test).ts" \
    --out api \
    --readme none \
    --name "Documents for @litert/otp" \
    --plugin typedoc-plugin-markdown \
    --plugin typedoc-vitepress-theme \
    --sourceLinkTemplate "https://github.com/litert/otp.js/blob/master/{path}#L{line}" \
    $SRC_DIR/URL.ts \
    $SRC_DIR/HOTP.ts \
    $SRC_DIR/TOTP.ts \
    $SRC_DIR/Constants.ts

mv api $API_DOC_OUTPUT_DIR
