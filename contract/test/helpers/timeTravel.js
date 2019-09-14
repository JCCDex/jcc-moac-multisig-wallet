const jsonrpc = '2.0'
const id = 0
web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send
const send = (method, params = []) =>
  web3.currentProvider.sendAsync({ id, jsonrpc, method, params }, function(err){})

const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

module.exports = timeTravel;