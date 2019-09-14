pragma solidity 0.4.24;
import "./SafeMath.sol";

/**
 * @dev 地址列表共通，处理地址列表，保证不重复.
 */
library AddressList {
  using SafeMath for uint256;

  struct addressMap
  {
    mapping(address => uint) mapList;
    address[] list;
  }

  function exist(addressMap storage self, address _addr) internal view returns(bool) {
    if(self.list.length == 0) return false;
    return (self.list[self.mapList[_addr]] == _addr);
  }

  function insert(addressMap storage self, address _addr) internal returns (bool){
    if (exist(self, _addr)) {
      return false;
    }

    self.mapList[_addr] = self.list.push(_addr).sub(1);

    return true;
  }

  function remove(addressMap storage self, address _addr) internal returns (bool){
    if (!exist(self, _addr)) {
      return false;
    }

    uint row2Del = self.mapList[_addr];
    address keyToMove = self.list[self.list.length.sub(1)];
    self.list[row2Del] = keyToMove;
    self.mapList[keyToMove] = row2Del;
    self.list.length = self.list.length.sub(1);

    return true;
  }

  function count(addressMap storage self) internal view returns (uint){
    return self.list.length;
  }

  function get(addressMap storage self, uint index) internal view returns (address){
    require(index < self.list.length, "index must small than current count");
    return self.list[index];
  }

  function getAddress(addressMap storage self, uint from, uint _count) internal view returns (address[] memory){
    uint _idx = 0;
    require(_count > 0, "return number must bigger than 0");
    address[] memory res = new address[](_count);
    for (uint i = from; i < self.list.length; i++) {
      if (_idx == _count) {
        break;
      }

      res[_idx] = self.list[i];
      _idx = _idx.add(1);
    }

    return res;
  }
}