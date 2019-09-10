module.exports = {
  'test Main page': (browser) => {
    browser
      .url('http://localhost:3000')
      .resizeWindow(414, 736)
      .waitForElementVisible('body')
    browser.expect.elements('.mutisig-wallet-tab-bar-item').count.to.equal(3)
    browser.assert.urlEquals('http://localhost:3000/#/home')
      .saveScreenshot('./test/e2e/reports/home.png')
    browser.click(".mutisig-wallet-tab-bar-item-wrap > a:nth-child(2)")
    browser.assert.urlEquals('http://localhost:3000/#/vote')
      .saveScreenshot('./test/e2e/reports/vote.png')
    browser.click(".mutisig-wallet-tab-bar-item-wrap > a:nth-child(3)")
    browser.assert.urlEquals('http://localhost:3000/#/mine')
      .saveScreenshot('./test/e2e/reports/mine.png')
    browser.end();
  }
};