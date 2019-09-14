/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const JccMoacMultiSig = artifacts.require('JccMoacMultiSig');
const zeroAccount = require('./helpers/zeroAccount');
const assertRevert = require('./helpers/assertRevert');

contract('JccMoacMultiSig', (accounts) => {
  let multiWallet;
  beforeEach(async () => {
    multiWallet = await JccMoacMultiSig.new({ from: accounts[0] });
  });

  it('JccMoacMultiSig configOnce test', async () => {
    // 测试少于3人
    await assertRevert(multiWallet.configureOnce(2, 50, [accounts[1], accounts[2]]));

    // 测试少于50%调用
    await assertRevert(multiWallet.configureOnce(3, 30, [accounts[1], accounts[2], accounts[3]]));

    // 测试钱包数量和设置不一致
    await assertRevert(multiWallet.configureOnce(4, 60, [accounts[1], accounts[2], accounts[3]]));

    let ret = await multiWallet.configureOnce(3, 50, [accounts[1], accounts[2], accounts[3]]);
    assert.notEqual(ret.tx, null);

    // 测试第二次调用
    await assertRevert(multiWallet.configureOnce(3, 50, [accounts[1], accounts[2], accounts[3]]));
  });

  it('JccMoacMultiSig set/get deposit flag', async () => {
    await multiWallet.configureOnce(3, 50, [accounts[1], accounts[2], accounts[3]]);

    let stop;
    stop = await multiWallet.getStopDeposit();
    assert.equal(stop, false);

    await multiWallet.setStopDeposit(true);

    stop = await multiWallet.getStopDeposit({ from: accounts[1] });
    assert.equal(stop, true);
  });
});
