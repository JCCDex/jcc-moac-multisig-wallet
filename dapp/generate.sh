#!/bin/bash

cross-env Contract=$1 Node=$2 Mainnet=$3 nuxt-ts generate

# test node
# npm run generate "0x98a3643e860f7f782194dd3e80408f90d4e423ae" https://mtnode1.jccdex.cn false