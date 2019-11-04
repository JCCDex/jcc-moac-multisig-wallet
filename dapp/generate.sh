#!/bin/bash

cross-env Contract=$1 Node=$2 Mainnet=$3 nuxt-ts generate

# test node
# npm run generate "0x959fe8e1b07ce9b376f8ab76de6bdfae78c25e3a" https://mtnode1.jccdex.cn false