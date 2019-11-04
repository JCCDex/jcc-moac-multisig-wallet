#!/bin/bash
cross-env Contract=$1 Node=$2 Mainnet=$3 MoacAddress=$4 MoacSecret=$5 nuxt-ts

# internal test node

# 0x2995c1376a852e4040caf9dbae2c765e24c37a15 isn't voter
# npm run dev 0x959fe8e1b07ce9b376f8ab76de6bdfae78c25e3a http://192.168.66.249:8546 false 0x2995c1376a852e4040caf9dbae2c765e24c37a15 ca6dbabef201dce8458f29b2290fef4cb80df3e16fef96347c3c250a883e4486

# 0x780d9da80c427defd49d458b365e0e77808f5086 is voter
# npm run dev 0x959fe8e1b07ce9b376f8ab76de6bdfae78c25e3a http://192.168.66.249:8546 false 0x780d9da80c427defd49d458b365e0e77808f5086 cdb0d203c3f0aa123c5ef909b67bfcf584e20c6a807fd0e51c821298bd2acc08


# public test node

# 0x2995c1376a852e4040caf9dbae2c765e24c37a15 isn't voter
# npm run dev 0x959fe8e1b07ce9b376f8ab76de6bdfae78c25e3a https://mtnode1.jccdex.cn false 0x2995c1376a852e4040caf9dbae2c765e24c37a15 ca6dbabef201dce8458f29b2290fef4cb80df3e16fef96347c3c250a883e4486

# 0x780d9da80c427defd49d458b365e0e77808f5086 is voter
# npm run dev 0x959fe8e1b07ce9b376f8ab76de6bdfae78c25e3a https://mtnode1.jccdex.cn false 0x780d9da80c427defd49d458b365e0e77808f5086 cdb0d203c3f0aa123c5ef909b67bfcf584e20c6a807fd0e51c821298bd2acc08
