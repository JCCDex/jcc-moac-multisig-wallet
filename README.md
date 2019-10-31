# jcc-moac-multisig-wallet

[![Build Status](https://travis-ci.com/JCCDex/jcc-moac-multisig-wallet.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-moac-multisig-wallet)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## DAPP基本功能

1. 管理员只能初始化投票条件、决定是否接受存款以及合约自杀
2. 锁仓资金从哪里来，提现就回到哪里去，任何人都无权修改钱包地址
3. 投票人可以就投票生效百分比发起提案并投票
4. 投票人可以提名新投票人和罢免投票人提案，合约底线是不少于3个投票人，生效不得低于50%
5. 锁仓人可以在锁仓后发起提现提案，只有投票通过后，才能转移资金
6. 一旦投票形成决议，任何人都能发起执行，将提案生效，这个过程可以利用预言机机制自动执行

## 合约接口说明

* configOnce 管理员特权，只能在初始化投票人和投票规则时使用一次
* getStopDeposit/setStopDeposit 获取锁仓标识和设置锁仓标识， 设置只有管理员可以操作，禁止锁仓后，不接受存款
* createPercentProposal 投票生效百分比规则提案
* createVoterProposal 报名成为投票人的提案，任何人都可以发起提案申请成为投票人
* createRecallProposal 罢免投票人的提案，只有投票人才能发起提案
* createWithdrawProposal 发起提现的提案，只有锁仓的用户才有资格发起
* voteTopic 投票人投票
* batchVoteTopic 批量投票，其实就是调用voteTopic,只要有一个投票失败，就立刻返回false，终止批量投票
* deposit 锁仓
* getBalance 获取用户的提现额度
* getDepositBalance/getWithdrawBalance 获取用户的已存款和已提现金额，二者相差即为用户可提现金额
* getDepositCount/getWithdrawCount 锁仓和提现的钱包数量统计
* getDepositList/getWithdrawList 锁仓和提现的钱包明细清单
* getPercent 获取投票生效的百分比规则
* getVoters/isVoter 获取所有投票人信息/判断自己是否是投票人
* getVotingCount/getVotedCount 全部待决提案数量/全部已决提案数量
* getMyVotingCount/getMyVotedCount 我发起的待决提案数量/已决提案数量
* getAllVotingTopicIds/getAllMyVotingTopicIds 全部待决提案索引/我发起的待决提案索引
* getVotedTopicIds/getMyVotedTopicIds 已决提案索引/我发起的已决提案索引
* getTopic 获取提案详细信息
* getDetailIdxs 获得提案投票详情信息索引
* getVoteDetail 投票详情
* getVoteDetailsByTopic 获取指定提案下所有的投票详情信息
* haveExpire 扫描有无需要执行的待决提案
* processExpire 处理待决提案，任何人都有权处理，最佳办法是通过预言机执行
* jccMoacAlarmCallback 墨客预言机回调接口
* setAlarm 在预言机设置周期任务
* removeAlarm 在预言机删除周期任务

## 合约流程

1. 创建合约
2. 管理员调用configureOnce设置初始投票比例、投票人数和投票人
3. 锁仓人员可以打款
4. 管理员设置打款结束标志，进入锁仓状态
5. 在第3步开始投票人可以发起修改投票比例，增选投票人，罢免投票人提案并进行投票表决
6. 锁仓人员在锁仓状态下才能发起提现提案，供投票人进行表决
7. 只要提案符合通过标准，任何人都能发起执行

## 合约相关gas消耗清单

参见 [chain3的estimateGas问题](https://github.com/MOACChain/chain3/issues/15)

1. 创建合约大约需要430万
2. configureOnce初始化有5个参与者，需要25万
3. deposit需要8.6万
4. setStopDeposit 需要2.3万
5. createPercentProposal发起投票百分比提案 22万
6. createRecallProposal 罢免投票人 24万
7. createVoterProposal 罢免投票人 24万
8. createVoterProposal 罢免投票人 24万
9. voteTopic 投票 14万
10. processExpire 处理两个提案 14万 处理5个提现请求70万
11. createWithdrawProposal 21万

以上为实际记录的gas，实际运行时请增加20%比较保险

## truffle提速的技巧

运行 truffle watch

然后在另外一个console运行truffle test，不需要重复编译合约，直接运行测试。

## 合约地址

测试网络: 0x98a3643e860f7f782194dd3e80408f90d4e423ae

主网: 0xeac5e8a57eea6c3b20bdbee85b7771d550bf01ff

## 合约部署后的常用配置指令

部署好后，对初始投票人和投票比例做初始化，只能调用一次

```bash
# 初始化5个钱包作为投票人，表决比例是50%，后续其他的投票人通过发起申请和投票即可当选
jcc_moac_tool --abi JccMoacMultiSig.json --contractAddr "多签名合约地址" --method "configureOnce" --parameters '5,50,["0x780d9da80c427defd49d458b365e0e77808f5086", "0x6afc5acd3f1db92e18094e1f6b8a878b27665f51", "0xf0fb6874e0da30c8108d3de55c1fec00f82faba2", "0x329a1891fba80498525e70d285d39d8091add46e", "0x60e78bd0f249125d5c266b5e3ca8ff73da0e7ef6"]' --gas_limit 280000


# 在预言机合约设置多签钱包合约地址为白名单
jcc_moac_tool --abi JccMoacAlarm.json --contractAddr 预言机合约地址 --method "addContract" --parameters '"多签名钱包合约地址"' --gas_limit 55000

# 在多签名钱包中注册定时任务到预言机合约：周期性任务，300秒执行一次
jcc_moac_tool --abi JccMoacMultiSig.json --contractAddr "多签名钱包合约地址" --method "setAlarm" --parameters '"预言机合约地址",1,300' --gas_limit 200000

# 停止锁仓充值，停止充值后，无法充值，用户可以提出提现的提案；如果允许充值，则禁止发起提现提案
./src/jcc_moac_tool --abi JccMoacMultiSig.json --contractAddr "多签名钱包合约地址" --method "setStopDeposit" --parameters true --gas_limit 23000

# 允许充值锁仓
./src/jcc_moac_tool --abi JccMoacMultiSig.json --contractAddr "多签名钱包合约地址" --method "setStopDeposit" --parameters false --gas_limit 23000
```
