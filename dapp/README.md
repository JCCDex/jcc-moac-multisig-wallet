# dapp

> MOAC多签名钱包DAPP

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000

contractAddress: 合约地址(contract目录下合约部署后的地址)
node: 节点地址
mainnet: true(主网) false(测试网)
testAddress: 测试钱包地址
testSecret: 测试钱包秘钥

$ npm run dev $contractAddress $node $mainnet $testAddress $testSecret


# generate static project
# 部署后请在TokenPocket中打开网页
# 使用TokenPocket默认MOAC节点，若获取失败则使用配置节点
$ npm run generate $contractAddress $node $mainnet
```
