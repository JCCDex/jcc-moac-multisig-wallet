# jcc-moac-mutisig-wallet

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
* deposit 锁仓
* getBalance 获取用户的提现额度
* getDepositBalance/getWithdrawBalance 获取用户的已存款和已提现金额，二者相差即为用户可提现金额
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

1. 创建合约大约需要370万
2. configureOnce初始化有5个参与者，需要25万
3. deposit需要8.6万
4. setStopDeposit 需要2.3万
5. createPercentProposal发起投票百分比提案 22万
6. voteTopic 投票 14万
7. processExpire 处理两个提案 14万 处理5个提现请求70万
8. createWithdrawProposal 21万

