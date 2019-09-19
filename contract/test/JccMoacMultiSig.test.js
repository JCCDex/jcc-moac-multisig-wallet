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

  it('JccMoacMultiSig vote percent proposal', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

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
    console.log(topic);
    assert.equal(topic.value, 66);
    assert.equal(topic.origin, 50);
    assert.equal(topic.sponsor, voter1);

    // 投票：合法投票，不合法投票
    await multiWallet.voteTopic(topicId, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId, Date.now(), true, { from: voter3 });
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
    await multiWallet.processExpire(topicId);
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 再检查percent
    percent = await multiWallet.getPercent();
    assert.equal(percent, 66);
  });

  it('JccMoacMultiSig add/recall voter', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 发起议题
    let topicId1 = Date.now();
    let topicId2 = topicId1 + 1;
    let topicId3 = topicId2 + 1;
    await multiWallet.createVoterProposal(topicId1, topicId1, topicId1 + 1000000, voter4, { from: voter2 });
    await multiWallet.createVoterProposal(topicId2, topicId2, topicId2 + 1000000, voter5, { from: voter3 });
    await multiWallet.createRecallProposal(topicId3, topicId3, topicId3 + 1000000, voter2, { from: voter1 });

    // 获取当前投票中的议题
    let votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 3);
    let votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 0);

    // 增选vote4
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId1, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter3 });
    await assertRevert(multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter4 }));

    await multiWallet.processExpire(topicId1);
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 罢免voter2
    await multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId3, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter4 });
    await assertRevert(multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter5 }));

    // 50% 不能通过
    await multiWallet.processExpire(topicId3);
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);

    // 再投一票
    await multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter3 });
    await multiWallet.processExpire(topicId3);
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 1);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 2);

    // 增选vote5
    await multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId2, Date.now(), false, { from: voter3 });
    await multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter4 });
    await assertRevert(multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter2 }));

    await multiWallet.processExpire(topicId2);
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 0);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 3);

    // 现在投票人有4个了
    let voters = await multiWallet.getVoters();
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
    let haveExpire = await multiWallet.haveExpire(topicId);
    assert.equal(haveExpire[1], 0);

    // 假设时间偏移了一段时间，重新求解待关闭议题，有数据
    await timeTravel(1010);
    haveExpire = await multiWallet.haveExpire(topicId + 1001000);
    assert.equal(haveExpire[1], 1);
  });
  it('JccMoacMultiSig deposit/withdraw proposal', async () => {
    await multiWallet.configureOnce(3, 50, [voter1, voter2, voter3]);

    // 用户发起存款 web3在MOAC下面要改成chain3
    await multiWallet.deposit({ from: user1, value: web3.utils.toWei('30') });
    await multiWallet.deposit({ from: user2, value: web3.utils.toWei('40') });
    await multiWallet.deposit({ from: user3, value: web3.utils.toWei('50') });
    await multiWallet.deposit({ from: user4, value: web3.utils.toWei('60') });
    await multiWallet.deposit({ from: user5, value: web3.utils.toWei('70') });

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
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId1, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter3 });

    await multiWallet.processExpire(topicId1);
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
    await multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId2, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId2, Date.now(), true, { from: voter3 });

    await multiWallet.processExpire(topicId2);

    // 测试可提现资金
    b2 = web3.utils.fromWei(await multiWallet.getBalance(user3));
    assert.equal(b2.toString(), '35');

    // 否决user5的提现请求
    await multiWallet.voteTopic(topicId3, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId3, Date.now(), false, { from: voter2 });
    // 因为超时自动否决
    await timeTravel(2010);

    await multiWallet.processExpire(topicId3);

    // 测试可提现资金
    let b3 = web3.utils.fromWei(await multiWallet.getBalance(user5));
    assert.equal(b3.toString(), '70');

    // 尝试自杀，将剩余225个资产转移
    let balanceOfAdmin1 = Number(web3.utils.fromWei(await web3.eth.getBalance(admin)));
    await multiWallet.kill({ from: admin });
    let balanceOfAdmin2 = Number(web3.utils.fromWei(await web3.eth.getBalance(admin)));
    assert.equal(225 - balanceOfAdmin2 + balanceOfAdmin1 < 0.001, true);
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
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter1 });
    await multiWallet.voteTopic(topicId1, Date.now(), false, { from: voter2 });
    await multiWallet.voteTopic(topicId1, Date.now(), true, { from: voter3 });
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

    await multiWallet.processExpire(topicId1);
    // 测试已决议题和待决议题数量变化
    votingCount = await multiWallet.getVotingCount();
    assert.equal(votingCount, 2);
    votedCount = await multiWallet.getVotedCount();
    assert.equal(votedCount, 1);
  });
});
