/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const MockAddressList = artifacts.require('MockAddressList');

contract('AddressList', (accounts) => {
  let al;
  beforeEach(async () => {
    al = await MockAddressList.new();
  });

  it('AddressList test', async () => {
    await al.insert(20190101, accounts[1]);
    await al.insert(20190101, accounts[2]);
    let count = await al.count(20190101);
    assert.equal(count, 2);

    await al.insert(20190101, accounts[2]);
    await al.insert(20190101, accounts[3]);
    count = await al.count(20190101);
    assert.equal(count, 3);

    // 当前数据顺序  account:[1,2,3]
    await al.remove(20190101, accounts[2]);
    count = await al.count(20190101);
    assert.equal(count, 2);

    // 当前数据顺序  account:[1,-,3]
    await al.insert(20190101, accounts[4]);
    // 当前数据顺序  account:[1,-,3,4]
    let addr = await al.get(20190101, 2)
    // console.log((await al.get(20190101, 0)), (await al.get(20190101, 1)), (await al.get(20190101, 2)), (await al.get(20190101, 3)))
    // console.log(accounts[1], accounts[2], accounts[3], accounts[4])
    assert.equal(accounts[4], addr);

    await al.insert(20190101, accounts[2]);
    // 当前数据顺序  account:[1,3,4,2]
    addr = await al.get(20190101, 2)
    assert.equal(accounts[4], addr);

    let all = await al.getAddress(20190101, 0, 4);
    assert.equal(all.length, 4);
  });
});
