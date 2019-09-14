pragma solidity 0.4.24;

import "../utils/AddressList.sol";

// 定义一个调用AddressList的合约
contract MockAddressList {
  using AddressList for AddressList.addressMap;

  mapping (uint => AddressList.addressMap) planUsers;

  function insert(uint _id, address _addr) public returns (bool) {
    return planUsers[_id].insert(_addr);
  }

  function remove(uint _id, address _addr) public returns (bool) {
    return planUsers[_id].remove(_addr);
  }

  function get(uint _id, uint _idx) public view returns (address) {
    return planUsers[_id].get(_idx);
  }

  function getAddress(uint _id, uint from, uint _count) public view returns (address[] memory) {
    return planUsers[_id].getAddress(from, _count);
  }

  function count(uint _id) public view returns (uint) {
    return planUsers[_id].count();
  }
}
