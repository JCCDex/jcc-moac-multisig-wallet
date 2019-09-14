/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const MockBalanceList = artifacts.require('MockBalanceList');

contract('BalanceList', (accounts) => {
  let al;
  beforeEach(async () => {
    al = await MockBalanceList.new();
  });

  it('BalanceList test', async () => {
    await al.add(accounts[1], 1);
    await al.add(accounts[2], 2);
    let count = await al.count();
    assert.equal(count, 2);

    await al.add(accounts[2], 2);
    await al.add(accounts[3], 3);
    count = await al.count();
    assert.equal(count, 3);

    await al.sub(accounts[2], 2);
    count = await al.count();
    assert.equal(count, 3);
    await al.sub(accounts[2], 2);
    count = await al.count();
    assert.equal(count, 3);

    await al.add(accounts[4], 4);
    let amount = await al.balance(accounts[2])
    assert.equal(amount, 0);
    count = await al.count();
    assert.equal(count, 4);

    await al.add(accounts[2], 2);
    amount = await al.balance(accounts[2])
    assert.equal(amount, 2);
    amount = await al.balance(accounts[4])
    assert.equal(amount, 4);
    count = await al.count();
    assert.equal(count, 4);

    let all = await al.getAddress(0, 2);
    // console.log(JSON.stringify(all));
    assert.equal(all.length, 2);
  });
});
