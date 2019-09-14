pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "../utils/BalanceList.sol";

// 定义一个调用BalanceList的合约
contract MockBalanceList {
  using BalanceList for BalanceList.balanceMap;

  BalanceList.balanceMap _balance;

  function add(address _addr, uint _amount) public returns (uint) {
    return _balance.add(_addr, _amount);
  }

  function sub(address _addr, uint _amount) public returns (uint) {
    return _balance.sub(_addr, _amount);
  }

  function balance(address _addr) public view returns (uint) {
    return _balance.balance(_addr);
  }

  function getAddress(uint from, uint count) public view returns (address[] memory) {
    return _balance.getAddress(from, count);
  }

  function count() public view returns (uint) {
    return _balance.count();
  }
}
