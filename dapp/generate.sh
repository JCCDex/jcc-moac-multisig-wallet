#!/bin/bash

cross-env Contract=$1 Node=$2 Mainnet=$3 nuxt-ts generate

# npm run generate "0x5ca7bae311d4092d23b2854e895548d451dcae5c" http://192.168.66.249:8546 false