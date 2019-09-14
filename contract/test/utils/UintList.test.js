/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-undef */
const MockUintList = artifacts.require('MockUintList');

contract('UintList', (accounts) => {
  let al;
  beforeEach(async () => {
    al = await MockUintList.new();
  });

  it('UintList test', async () => {
    await al.insert(20190101, 1);
    await al.insert(20190101, 2);
    let count = await al.count(20190101);
    assert.equal(count, 2);

    await al.insert(20190101, 2);
    await al.insert(20190101, 3);
    count = await al.count(20190101);
    assert.equal(count, 3);

    // 当前数据顺序  account:[1,2,3]
    await al.remove(20190101, 2);
    count = await al.count(20190101);
    assert.equal(count, 2);

    // 当前数据顺序  account:[1,-,3]
    await al.insert(20190101, 4);
    // 当前数据顺序  account:[1,-,3,4]
    let data = await al.get(20190101, 2)
    assert.equal(4, data);

    let all = await al.getAll(20190101);
    assert.equal(all.length, 3);
  });
});
