pragma solidity 0.4.24;
import "./SafeMath.sol";

/**
 * @dev 资产列表共通，除资产负债之外提供一个账目清单数组，便于统计和查找.
 */
library BalanceList {
  using SafeMath for uint256;

  struct element
  {
    // address addr;
    uint idx;
    uint balance;
  }
  struct balanceMap
  {
    mapping(address => element) mapList;
    address[] list;
  }

  function add(balanceMap storage self, address _addr, uint _amount) internal returns (uint){
    if (self.mapList[_addr].idx == 0) {
      // 新建数据
      self.list.push(_addr);
      self.mapList[_addr].balance = _amount;
      self.mapList[_addr].idx = self.list.length;
    }else{
      // 对于已经存在的数据更新状态即可
      self.mapList[_addr].balance = self.mapList[_addr].balance.add(_amount);
    }

    return self.mapList[_addr].balance;
  }

  function sub(balanceMap storage self, address _addr, uint _amount) internal returns (uint){
    self.mapList[_addr].balance = self.mapList[_addr].balance.sub(_amount);
    return self.mapList[_addr].balance;
  }

  function count(balanceMap storage self) internal view returns (uint){
    return self.list.length;
  }

  function balance(balanceMap storage self, address _addr) internal view returns (uint){
    return self.mapList[_addr].balance;
  }

  function get(balanceMap storage self, uint index) internal view returns (uint){
    require(index <= self.list.length && index > 0, "index must small than current count and not zero");

    return self.mapList[self.list[index - 1]].balance;
  }

  // 获取所有，from = 1, step = count函数的返回值，本函数可以用于分页查询
  function getAddress(balanceMap storage self, uint from, uint _count) internal view returns (address[] memory){
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