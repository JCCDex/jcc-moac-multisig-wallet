#!/bin/bash

cross-env Contract=$1 Node=$2 Mainnet=$3 nuxt-ts generate

# test node
# npm run generate "0xf08e4103ab71564dffe092fe4472bae43847b48c" https://mtnode1.jccdex.cn false