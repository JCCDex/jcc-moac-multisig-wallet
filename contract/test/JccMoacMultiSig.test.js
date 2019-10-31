/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const JccMoacMultiSig = artifacts.require('JccMoacMultiSig');
const zeroAccount = require('./helpers/zeroAccount');
const assertRevert = require('./helpers/assertRevert');
const timeTravel = require('./helpers/timeTravel');

contract('JccMoacMultiSig', (accounts) => {
  let multiWallet;
  let admin = accounts[0];

  let voter1 = accounts[0];
  let voter2 = accounts[1];
  let voter3 = accounts[2];
  let voter4 = accounts[3];
  let voter5 = accounts[4];

  let user1 = accounts[3];
  let user2 = accounts[4];
  let user3 = accounts[5];
  let user4 = accounts[6];
  let user5 = accounts[7];

  let batchVote = async (_topicId, _voters, _answers) => {
    for (let i = 0; i < _voters.length; i++) {
      await multiWallet.voteTopic(_topicId, Date.now(), _answers[i], { from: _voters[i] });
    }
  }
  let batchTransfer = async (_users, _amounts) => {
    for (let i = 0; i < _users.length; i++) {
      await multiWallet.deposit({ from: _users[i], value: web3.utils.toWei('' + _amounts[i]) });
    }
  }
  beforeEach(async () => {
    multiWallet = await JccMoacMultiSig.new({ from: admin });
  });

  it('JccMoacMultiSig configOnce test', async () => {
    // 测试少于3人
    await assertRevert(multiWallet.configureOnce(2, 50, [voter2, voter3]));

    // 测试少于50%调用
    await assertRevert(multiWallet.configureOnce(3, 30, [voter2, voter3, voter4]));

    // 测试钱包数量和设置不一致
    await assertRevert(multiWallet.configureOnce(4, 60, [voter2, voter3, voter4]));

    let ret = await multiWallet.configureOnce(3, 50, [voter2, voter3, voter4]);
    assert.notEqual(ret.tx, null);

    // 测试第二次调用
    await assertRevert(multiWallet.configureOnce(3, 50, [voter2, voter3, voter4]));
  });

  it('JccMoacMultiSig set/get deposit flag', async () => {
    await multiWallet.configureOnce(3, 50, [voter2, voter3, voter4]);

    let stop;
    stop = await multiWallet.getStopDeposit();
    assert.equal(stop, false);

    await multiWallet.setStopDeposit(true);

    stop = await multiWallet.getStopDeposit({ from: voter2 });
    assert.equal(stop, true);
  });

  it('JccMoacMultiSig vote percent proposal success', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);
    let isVoter = await multiWallet.isVoter(voter1, { from: voter2 });
    assert.equal(isVoter, true);
    isVoter = await multiWallet.isVoter(voter4, { from: voter4 });
    assert.equal(isVoter, false);

    // 发起议题
    let topicId = Date.now();
    await multiWallet.createPercentProposal(topicId, topicId, topicId + 1000000, 66);
    // 投票百分比只能一个个串行
    await assertRevert(multiWallet.createPercentProposal(topicId + 1, topicId + 1, topicId + 1000000, 60, { from: voter2 }));

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);
    let topic = await multiWallet.getTopic(topicId);
    assert.equal(topic.value, 66);
    assert.equal(topic.origin, 50);
    assert.equal(topic.sponsor, voter1);

    // 投票：合法投票，不合法投票
    await batchVote(topicId, [voter1, voter2, voter3], [true, false, true]);
    await assertRevert(multiWallet.voteTopic(topicId, Date.now(), true, { from: voter4 }));

    // 获得投票信息
    let voteIdxs = await multiWallet.getDetailIdxs(topicId);
    assert.equal(voteIdxs.length, 3);

    let voteDetail = await multiWallet.getVoteDetail(topicId, { from: voter2 });
    assert.equal(voteDetail.voter, voter2);
    // 获取一个不存在的投票记录
    voteDetail = await multiWallet.getVoteDetail(topicId, { from: voter4 });
    assert.equal(voteDetail.voter, zeroAccount);

    let allDetail = await multiWallet.getVoteDetailsByTopic(topicId);
    assert.equal(allDetail[2].voter, voter3);

    // 先检查原来的percent
    let percent = await multiWallet.getPercent();
    assert.equal(percent, 50);

    // 扫描和关闭议题：按照结果关闭
    // 传一个时间不到，投票结果完成的
    let haveExpire = await multiWallet.haveExpire(topicId);
    assert.equal(haveExpire[1], 1);

    // 获得新的百分比
    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 再检查percent
    percent = await multiWallet.getPercent();
    assert.equal(percent, 66);
  });

  it('JccMoacMultiSig vote percent proposal fail', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);
    let isVoter = await multiWallet.isVoter(voter1, { from: voter2 });
    assert.equal(isVoter, true);
    isVoter = await multiWallet.isVoter(voter4, { from: voter4 });
    assert.equal(isVoter, false);

    // 发起议题
    let topicId = Date.now();
    await multiWallet.createPercentProposal(topicId, topicId, topicId + 1000000, 66);
    // 投票百分比只能一个个串行
    await assertRevert(multiWallet.createPercentProposal(topicId + 1, topicId + 1, topicId + 1000000, 60, { from: voter2 }));

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);
    let topic = await multiWallet.getTopic(topicId);
    assert.equal(topic.value, 66);
    assert.equal(topic.origin, 50);
    assert.equal(topic.sponsor, voter1);

    // 投票：合法投票，不合法投票
    await batchVote(topicId, [voter1, voter2, voter3], [false, false, true]);
    await assertRevert(multiWallet.voteTopic(topicId, Date.now(), true, { from: voter4 }));

    // 获得投票信息
    let voteIdxs = await multiWallet.getDetailIdxs(topicId);
    assert.equal(voteIdxs.length, 3);

    let voteDetail = await multiWallet.getVoteDetail(topicId, { from: voter2 });
    assert.equal(voteDetail.voter, voter2);
    // 获取一个不存在的投票记录
    voteDetail = await multiWallet.getVoteDetail(topicId, { from: voter4 });
    assert.equal(voteDetail.voter, zeroAccount);

    let allDetail = await multiWallet.getVoteDetailsByTopic(topicId);
    assert.equal(allDetail[2].voter, voter3);

    // 先检查原来的percent
    let percent = await multiWallet.getPercent();
    assert.equal(percent, 50);

    // 扫描和关闭议题：按照结果关闭
    // 传一个时间不到，投票结果完成的
    let haveExpire = await multiWallet.haveExpire(topicId);
    assert.equal(haveExpire[1], 1);

    // 获得新的百分比
    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 再检查percent
    percent = await multiWallet.getPercent();
    assert.equal(percent, 50);
  });

  it('JccMoacMultiSig add/recall voter', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;
    let topicId3 = topicId2 + 1;
    let topicId4 = topicId3 + 1;
    await multiWallet.createVoterProposal(topicId1, topicId1, topicId1 + 1000000, voter4, { from: voter2 });
    await multiWallet.createVoterProposal(topicId2, topicId2, topicId2 + 1000000, voter5, { from: voter3 });
    await multiWallet.createRecallProposal(topicId3, topicId3, topicId3 + 1000000, voter2, { from: voter1 });

    // 检查一个人同一时间只能发起一个提名投票
    await assertRevert(multiWallet.createVoterProposal(topicId4, topicId4, topicId4 + 1000000, voter5, { from: voter2 }));
    await assertRevert(multiWallet.createRecallProposal(topicId4, topicId4, topicId4 + 1000000, voter3, { from: voter1 }));

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 3);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);

    // 测试提案者提案信息
    let votingCountBySponsor = await multiWallet.getMyVotingCount({ from: voter2 });
    assert.equal(votingCountBySponsor, 1);

    // 增选vote4
    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);
    await assertRevert(multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter4 }));

    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    votingCountBySponsor = await multiWallet.getMyVotingCount({ from: voter2 });
    assert.equal(votingCountBySponsor, 0);

    // 罢免voter2
    await batchVote(topicId3, [voter1, voter2], [true, false]);
    await assertRevert(multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter5 }));

    // 不足50% 不能通过
    await multiWallet.processExpire(Date.now());
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 再投一票
    await multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter3 });
    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 2);

    let ids = await multiWallet.getVotedTopicIds(0, 0);
    // console.log(ids);
    assert.equal(ids.length, 2);

    // 增选vote5:反对增选
    await batchVote(topicId2, [voter1, voter3, voter4], [false, false, true]);
    await assertRevert(multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter2 }));

    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 3);

    // 现在投票人有3个了
    let voters = await multiWallet.getVoters();
    assert.equal(voters.length, 3);

    // 发起增选voter2
    await multiWallet.createVoterProposal(topicId4, topicId4, topicId4 + 1000000, voter2, { from: voter1 });

    // 投票
    await batchVote(topicId4, [voter1, voter3, voter4], [true, true, true]);

    await multiWallet.processExpire(Date.now());
    // 现在投票人有4个了
    voters = await multiWallet.getVoters();
    assert.equal(voters.length, 4);
  });

  it('JccMoacMultiSig vote timeout test case', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 发起议题
    let topicId = Date.now();
    await multiWallet.createPercentProposal(topicId, topicId, topicId + 1000000, 66);

    // 投票：合法投票，不合法投票
    await multiWallet.voteTopic(topicId, Date.now(), true, { from: voter1 });
    await assertRevert(multiWallet.voteTopic(topicId, Date.now(), true, { from: voter4 }));

    // 扫描和关闭议题：按照结果关闭
    // 投票未完成，时间也未到
    let haveExpire = await multiWallet.haveExpire(Date.now());
    assert.equal(haveExpire[1], 0);

    // 假设时间偏移了一段时间，重新求解待关闭议题，有数据
    await timeTravel(1010);
    haveExpire = await multiWallet.haveExpire(Date.now() + 1001000);
    assert.equal(haveExpire[1], 1);
  });
  it('JccMoacMultiSig deposit/withdraw proposal', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 用户发起存款 web3在MOAC下面要改成chain3
    await batchTransfer([user1, user2, user3, user4, user5], ['30', '40', '50', '60', '70']);

    // 只有设置停止存款后，才能发起提案去提现
    await multiWallet.setStopDeposit(true);

    // 验证可取的数量
    let b2 = web3.utils.fromWei(await multiWallet.getBalance(user2));
    assert.equal(b2.toString(), '40');

    // // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;
    let topicId3 = topicId2 + 1;
    await multiWallet.createWithdrawProposal(topicId1, topicId1, topicId1 + 1000000, web3.utils.toWei('10'), { from: user1 });
    await multiWallet.createWithdrawProposal(topicId2, topicId2, topicId2 + 1000000, web3.utils.toWei('15'), { from: user3 });
    await multiWallet.createWithdrawProposal(topicId3, topicId3, topicId3 + 1000000, web3.utils.toWei('13'), { from: user5 });

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 3);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);
    let user1Balance1 = web3.utils.fromWei(await web3.eth.getBalance(user1));

    // 通过user1的提现请求 提现 10个
    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);

    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);
    let user1Balance2 = web3.utils.fromWei(await web3.eth.getBalance(user1));

    // 测试可提现资金
    let b1 = web3.utils.fromWei(await multiWallet.getBalance(user1));
    assert.equal(b1.toString(), '20');
    assert.equal(10 + Number(user1Balance1) - Number(user1Balance2) < 0.00000001, true);

    // 通过user3的提现请求 提现15个
    await batchVote(topicId2, [voter1, voter2, voter3], [true, false, true]);

    await multiWallet.processExpire(Date.now());

    // 测试可提现资金
    b2 = web3.utils.fromWei(await multiWallet.getBalance(user3));
    assert.equal(b2.toString(), '35');

    // 否决user5的提现请求
    await batchVote(topicId3, [voter1, voter2], [true, false]);

    // 因为超时自动否决
    await timeTravel(2010);

    await multiWallet.processExpire(Date.now());

    // 测试可提现资金
    let b3 = web3.utils.fromWei(await multiWallet.getBalance(user5));
    assert.equal(b3.toString(), '70');

    // 尝试自杀，将剩余225个资产转移
    let balanceOfAdmin1 = Number(web3.utils.fromWei(await web3.eth.getBalance(admin)));
    await multiWallet.kill({ from: admin });
    let balanceOfAdmin2 = Number(web3.utils.fromWei(await web3.eth.getBalance(admin)));
    assert.equal(225 - balanceOfAdmin2 + balanceOfAdmin1 < 0.001, true);
  });

  it('JccMoacMultiSig deposit/withdraw proposal twice', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 用户发起存款 web3在MOAC下面要改成chain3
    await batchTransfer([user1, user2, user3, user4, user5], ['10', '10', '10', '10', '10']);

    // 只有设置停止存款后，才能发起提案去提现
    await multiWallet.setStopDeposit(true);

    // 验证可取的数量
    let b2 = web3.utils.fromWei(await multiWallet.getBalance(user2));
    assert.equal(b2.toString(), '10');

    // 验证可取现的总数量
    let bTotal;
    bTotal = web3.utils.fromWei(await web3.eth.getBalance(multiWallet.address));
    assert.equal(bTotal.toString(), '50');

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;
    let topicId3 = topicId2 + 1;
    let topicId4 = topicId3 + 1;
    let topicId5 = topicId4 + 1;
    await multiWallet.createWithdrawProposal(topicId1, topicId1, topicId1 + 1000000, web3.utils.toWei('10'), { from: user1 });
    await multiWallet.createWithdrawProposal(topicId2, topicId2, topicId2 + 1000000, web3.utils.toWei('10'), { from: user2 });
    await multiWallet.createWithdrawProposal(topicId3, topicId3, topicId3 + 1000000, web3.utils.toWei('10'), { from: user3 });
    await multiWallet.createWithdrawProposal(topicId4, topicId4, topicId4 + 1000000, web3.utils.toWei('10'), { from: user4 });
    await multiWallet.createWithdrawProposal(topicId5, topicId5, topicId5 + 1000000, web3.utils.toWei('10'), { from: user5 });

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 5);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);

    // 通过所有人的提现请求 提现 10个
    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId2, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId3, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId4, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId5, [voter1, voter2, voter3], [true, false, true]);

    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 5);

    // 测试可提现资金
    bTotal = web3.utils.fromWei(await web3.eth.getBalance(multiWallet.address));
    assert.equal(bTotal.toString(), '0');

    // ---------------------------------------------
    // 重新开启充值状态
    await multiWallet.setStopDeposit(false);

    // 用户发起存款 web3在MOAC下面要改成chain3
    await batchTransfer([user1, user2, user3, user4, user5], ['10', '10', '10', '10', '10']);

    // 只有设置停止存款后，才能发起提案去提现
    await multiWallet.setStopDeposit(true);

    // 验证可取的数量
    b2 = web3.utils.fromWei(await multiWallet.getBalance(user2));
    assert.equal(b2.toString(), '10');

    // 验证可取现的总数量
    bTotal = web3.utils.fromWei(await web3.eth.getBalance(multiWallet.address));
    assert.equal(bTotal.toString(), '50');

    // 发起议题
    topicId1 = Date.now();
    topicId2 = topicId1 + 1;
    topicId3 = topicId2 + 1;
    topicId4 = topicId3 + 1;
    topicId5 = topicId4 + 1;
    await multiWallet.createWithdrawProposal(topicId1, topicId1, topicId1 + 1000000, web3.utils.toWei('10'), { from: user1 });
    await multiWallet.createWithdrawProposal(topicId2, topicId2, topicId2 + 1000000, web3.utils.toWei('10'), { from: user2 });
    await multiWallet.createWithdrawProposal(topicId3, topicId3, topicId3 + 1000000, web3.utils.toWei('10'), { from: user3 });
    await multiWallet.createWithdrawProposal(topicId4, topicId4, topicId4 + 1000000, web3.utils.toWei('10'), { from: user4 });
    await multiWallet.createWithdrawProposal(topicId5, topicId5, topicId5 + 1000000, web3.utils.toWei('10'), { from: user5 });

    // 获取当前投票中的议题
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 5);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 5);

    // 通过所有人的提现请求 提现 10个
    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId2, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId3, [voter1, voter2, voter3], [true, false, true]);
    await batchVote(topicId4, [voter1, voter2, voter3], [false, false, true]);
    await batchVote(topicId5, [voter1, voter2, voter3], [false, false, true]);

    await multiWallet.processExpire(Date.now());

    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 10);

    // 验证可取的数量
    b2 = web3.utils.fromWei(await multiWallet.getBalance(user2));
    assert.equal(b2.toString(), '0');

    // 测试可提现资金
    bTotal = web3.utils.fromWei(await web3.eth.getBalance(multiWallet.address));
    assert.equal(bTotal.toString(), '20');
  });

  it('JccMoacMultiSig vote detail info', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;
    let topicId3 = topicId2 + 1;
    await multiWallet.createVoterProposal(topicId1, topicId1, topicId1 + 1000000, voter4, { from: voter2 });
    await multiWallet.createVoterProposal(topicId2, topicId2, topicId2 + 1000000, voter5, { from: voter3 });
    await multiWallet.createRecallProposal(topicId3, topicId3, topicId3 + 1000000, voter2, { from: voter1 });

    // 增选vote4
    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);
    await assertRevert(multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter4 }));

    // 获得当前投票信息
    // 获得当前所有投票索引：知道多少人投票了，但是不知道细节
    let voteIdxs = await multiWallet.getDetailIdxs(topicId1);
    assert.equal(voteIdxs.length, 3)

    // 投票的当事人知道自己投了啥
    let voteDetail = await multiWallet.getVoteDetail(topicId1, { from: voter2 });
    assert.equal(voteDetail.voter, voter2);
    assert.equal(voteDetail.flag, false);

    let allDetail = await multiWallet.getVoteDetailsByTopic(topicId1);
    assert.equal(allDetail.length, 3)
    assert.equal(allDetail[2].voter, voter3);

    await multiWallet.processExpire(Date.now());
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 罢免 voter2
    await batchVote(topicId3, [voter1, voter2, voter4, voter3], [true, false, true, true]);
    await multiWallet.processExpire(Date.now());

    allDetail = await multiWallet.getVoteDetailsByTopic(topicId3);
    assert.equal(allDetail.length, 4)
    assert.equal(allDetail[2].voter, voter4);

    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 2);

    // 故意取没有投票信息的提案，应该抛出异常
    await assertRevert(multiWallet.getVoteDetailsByTopic(topicId2));
  });

  it('JccMoacMultiSig duplicate add voter test', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;

    await multiWallet.createVoterProposal(topicId1, topicId1, topicId1 + 1000000, voter4, { from: voter2 });
    await multiWallet.createVoterProposal(topicId2, topicId2, topicId2 + 1000000, voter4, { from: voter3 });

    await batchVote(topicId1, [voter1, voter2, voter3], [true, false, true]);
    await multiWallet.processExpire(Date.now());
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);
    let voters = await multiWallet.getVoters();
    assert.equal(voters.length, 4);

    await batchVote(topicId2, [voter1, voter2, voter3, voter4], [true, false, true, true]);
    await multiWallet.processExpire(Date.now());
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 2);
    voters = await multiWallet.getVoters();
    assert.equal(voters.length, 4);
  });

  it('JccMoacMultiSig duplicate remove voter test', async () => {
    await multiWallet.configureOnce(5, 50, [voter1, voter2, voter3, voter4, voter5]);

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;

    await multiWallet.createRecallProposal(topicId1, topicId1, topicId1 + 1000000, voter4, { from: voter2 });
    await multiWallet.createRecallProposal(topicId2, topicId2, topicId2 + 1000000, voter4, { from: voter3 });

    await batchVote(topicId1, [voter1, voter2, voter3, voter4], [true, true, true, true]);
    await multiWallet.processExpire(Date.now());
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);
    let voters = await multiWallet.getVoters();
    assert.equal(voters.length, 4);

    await batchVote(topicId2, [voter1, voter2, voter3, voter5], [true, true, true, true]);
    await multiWallet.processExpire(Date.now());
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 2);
    voters = await multiWallet.getVoters();
    assert.equal(voters.length, 4);
  });

  it('JccMoacMultiSig duplicate withdraw voter test', async () => {
    await multiWallet.configureOnce(5, 50, [voter1, voter2, voter3, voter4, voter5]);

    // 用户发起存款 web3在MOAC下面要改成chain3
    await batchTransfer([user1, user2, user3, user4, user5], ['5', '5', '5', '5', '5']);

    // 只有设置停止存款后，才能发起提案去提现
    await multiWallet.setStopDeposit(true);

    // 验证可取的数量
    let b2 = web3.utils.fromWei(await multiWallet.getBalance(user2));
    assert.equal(b2.toString(), '5');

    // 验证可取现的总数量
    let bTotal;
    bTotal = web3.utils.fromWei(await web3.eth.getBalance(multiWallet.address));
    assert.equal(bTotal.toString(), '25');

    /**
     * 关于同一个用户利用发起议题权限多次发起提现议题
     * 每个提议供给投票人投票时，会显示申请提现数量，总提现额度，已经提现数量
     * 看起来没问题，问题在于连续发起提议时候，在提议尚未生效前，每个提议看起来都合理，但是实际上会超提直到余额用尽
     * 因此对于提现请求，同一个人只能有一个未决提议，没有解决前禁止发起新提现，降低投票人的工作压力
     */
    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;

    await multiWallet.createWithdrawProposal(topicId1, topicId1, topicId1 + 1000000, web3.utils.toWei('1'), { from: user2 });
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);

    await assertRevert(multiWallet.createWithdrawProposal(topicId2, topicId2, topicId2 + 1000000, web3.utils.toWei('1'), { from: user2 }));
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);
  });
});
