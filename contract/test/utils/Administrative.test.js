const Administrative = artifacts.require('Administrative');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('Administrative', (accounts) => {
  let admin;

  beforeEach(async () => {
    admin = await Administrative.new();
  });

  it('Transfer zero address ownership test', async () => {
    await assertRevert(admin.transferOwnership(zeroAccount));
  });

  it('Transfer ownership by not-owner test', async () => {
    let before = await admin.owner.call();

    await assertRevert(admin.transferOwnership(accounts[2], {from: accounts[1]}));

    let after = await admin.owner.call();

    assert.equal(before, after);
  });

  it('Transfer ownership by owner test', async () => {
    let before = await admin.owner.call();
    assert.equal(before, accounts[0]);

    await admin.transferOwnership(accounts[2]);

    let after = await admin.owner.call();
    assert.equal(after, accounts[2]);
  });

  it('Transfer zero address administrator test', async () => {
    await assertRevert(admin.transferAdministrator(zeroAccount));
  });

  it('Transfer administrator by not-administrator test', async () => {
    let before = await admin.administrator.call();

    await assertRevert(admin.transferAdministrator(accounts[2], {from: accounts[1]}));

    let after = await admin.administrator.call();

    assert.equal(before, after);
  });

  it('Transfer administrator by administrator test', async () => {
    let before = await admin.administrator.call();
    assert.equal(before, accounts[0]);

    await admin.transferAdministrator(accounts[2]);

    let after = await admin.administrator.call();
    assert.equal(after, accounts[2]);
  });
});
