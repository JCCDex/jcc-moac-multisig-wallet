#!/bin/bash
cross-env Contract=$1 Node=$2 Mainnet=$3 MoacAddress=$4 MoacSecret=$5 nuxt-ts

# internal test node

# 0x5edccedfe9952f5b828937b325bd1f132aa09f60 isn't voter
# npm run dev 0x8eca41a83ea0efbd41401ed850774974bda6b697 http://192.168.66.249:8546 false 0x5edccedfe9952f5b828937b325bd1f132aa09f60 8fef3bc906ea19f0348cb44bca851f5459b61e32c5cae445220e2f7066db36d8

# 0x780d9da80c427defd49d458b365e0e77808f5086 is voter
# npm run dev 0x8eca41a83ea0efbd41401ed850774974bda6b697 http://192.168.66.249:8546 false 0x780d9da80c427defd49d458b365e0e77808f5086 cdb0d203c3f0aa123c5ef909b67bfcf584e20c6a807fd0e51c821298bd2acc08


# public test node

# 0x5edccedfe9952f5b828937b325bd1f132aa09f60 isn't voter
# npm run dev 0x8eca41a83ea0efbd41401ed850774974bda6b697 https://mtnode1.jccdex.cn false 0x5edccedfe9952f5b828937b325bd1f132aa09f60 8fef3bc906ea19f0348cb44bca851f5459b61e32c5cae445220e2f7066db36d8

# 0x780d9da80c427defd49d458b365e0e77808f5086 is voter
# npm run dev 0x8eca41a83ea0efbd41401ed850774974bda6b697 https://mtnode1.jccdex.cn false 0x780d9da80c427defd49d458b365e0e77808f5086 cdb0d203c3f0aa123c5ef909b67bfcf584e20c6a807fd0e51c821298bd2acc08
