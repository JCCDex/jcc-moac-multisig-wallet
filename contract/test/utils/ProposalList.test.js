/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const MockProposalList = artifacts.require('MockProposalList');
const zeroAccount = require('../helpers/zeroAccount');

contract('ProposalList', (accounts) => {
  let proposal;
  // 配置变动:投票通过百分比
  let TYPE_CONFIG_PERCENT = 2;
  // 提现
  let TYPE_WITHDRAW = 3;
  // 选举投票人
  let TYPE_VOTE = 4;
  // 罢免投票人
  let TYPE_RECALL = 5;

  beforeEach(async () => {
    proposal = await MockProposalList.new();
  });

  it('ProposalList test', async () => {
    let timestamp = Date.now();
    await proposal.insertTopic(timestamp, timestamp, timestamp + 10000000, TYPE_CONFIG_PERCENT, 50, 70, zeroAccount);

    let votingCount = await proposal.getVotingCount()
    assert.equal(votingCount, 1);

    timestamp = timestamp + 10;
    await proposal.insertTopic(timestamp, timestamp, timestamp + 10000000, TYPE_VOTE, 50, 70, accounts[3]);

    timestamp = timestamp + 10;
    await proposal.insertTopic(timestamp, timestamp, timestamp + 10000000, TYPE_RECALL, 50, 70, accounts[4]);

    votingCount = await proposal.getVotingCount()
    assert.equal(votingCount, 3);

    let allIds = await proposal.getAllVotingTopicIds();
    assert.equal(allIds.length, 3);

    let topic = await proposal.getTopic(allIds[1]);
    // console.log(topic);
    assert.equal(topic.target, accounts[3])
    assert.equal(topic.sponsor, accounts[0])

    // 测试投票
    await proposal.voteTopic(allIds[0], Date.now(), true, { from: accounts[1] });
    await proposal.voteTopic(allIds[0], Date.now(), true, { from: accounts[2] });
    await proposal.voteTopic(allIds[0], Date.now(), true, { from: accounts[3] });
    await proposal.voteTopic(allIds[0], Date.now(), false, { from: accounts[4] });
    await proposal.voteTopic(allIds[0], Date.now(), false, { from: accounts[5] });

    let voteIdxs = await proposal.getDetailIdxs(allIds[0]);
    assert.equal(voteIdxs.length, 5)

    let voteDetail = await proposal.getVoteDetail(allIds[0], { from: accounts[4] });
    assert.equal(voteDetail.voter, accounts[4]);

    let allDetail = await proposal.getVoteDetailsByTopic(allIds[0]);
    assert.equal(allDetail[3].voter, accounts[4]);

    // 测试移动待决到已决
    await proposal.moveTopic(allIds[0]);
    votingCount = await proposal.getVotingCount()
    assert.equal(votingCount, 2);
    votedCount = await proposal.getVotedCount()
    assert.equal(votedCount, 1);
  });
});
