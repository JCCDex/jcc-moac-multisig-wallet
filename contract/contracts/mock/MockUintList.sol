pragma solidity 0.4.24;

import "../utils/UintList.sol";

// 定义一个调用UintList的合约
contract MockUintList {
  using UintList for UintList.uintMap;

  mapping (uint => UintList.uintMap) userPlans;

  function insert(uint _id, uint _data) public returns (bool) {
    return userPlans[_id].insert(_data);
  }
  
  function remove(uint _id, uint _data) public returns (bool) {
    return userPlans[_id].remove(_data);
  }

  function getAll(uint _id) public view returns (uint[] memory) {
    return userPlans[_id].getAll();
  }

  function get(uint _id, uint _idx) public view returns (uint) {
    return userPlans[_id].get(_idx);
  }

  function count(uint _id) public view returns (uint) {
    return userPlans[_id].total();
  }
}
