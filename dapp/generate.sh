#!/bin/bash

cross-env Contract=$1 Node=$2 Mainnet=$3 nuxt-ts generate

# test node
# npm run generate "0x8eca41a83ea0efbd41401ed850774974bda6b697" https://mtnode1.jccdex.cn false