pragma solidity 0.4.24;
import "./SafeMath.sol";

/**
 * @dev uint为key的列表共通，保证不重复.
 */
library UintList {
  using SafeMath for uint256;

  struct element
  {
    uint data;
    uint idx;
    bool flag;
  }
  struct uintMap
  {
    mapping(uint => element) mapList;
    element[] list;
    uint count;
  }

  function insert(uintMap storage self, uint _data) internal returns (bool){
    if (self.mapList[_data].flag) {
      return false;
    }

    // 如果不一致，强制一致并添加到数组中
    self.mapList[_data].flag = true;
    if (self.mapList[_data].data != _data) {
      self.mapList[_data].data = _data;
      self.mapList[_data].idx = self.list.length;
      self.list.push(self.mapList[_data]);
    }else{
      // 对于已经存在的数据更新状态即可
      self.list[self.mapList[_data].idx].flag = true;
    }

    self.count = self.count.add(1);

    return true;
  }

  function remove(uintMap storage self, uint _data) internal returns (bool){
    if (self.mapList[_data].flag == false) {
      return false;
    }

    self.mapList[_data].flag = false;
    self.list[self.mapList[_data].idx].flag = false;

    self.count = self.count.sub(1);

    return true;
  }

  // function remove(uintMap storage self, uint index) internal returns (bool){
  //   require(index < self.count, "index must small than current count");
  //   uint _idx = 0;

  //   for (uint i = 0; i < self.list.length; i++) {
  //     if (self.list[i].flag == false) {
  //       continue;
  //     }
  //     if (_idx == index) {
  //       self.list[i].flag = false;
  //       self.mapList[self.list[i].addr].flag = false;

  //       self.count = self.count.sub(1);
        
  //       return true;
  //     }
  //     _idx = _idx.add(1);
  //   }

  //   return false;
  // }

  function total(uintMap storage self) internal view returns (uint){
    return self.count;
  }

  function get(uintMap storage self, uint index) internal view returns (uint){
    require(index < self.count, "index must small than current count");
    uint _idx = 0;

    for (uint i = 0; i < self.list.length; i++) {
      if (self.list[i].flag == false) {
        continue;
      }
      if (_idx == index) {
        return self.list[i].data;
      }
      _idx = _idx.add(1);
    }

    return 0;
  }

  function getAll(uintMap storage self) internal view returns (uint[] memory){
    if (self.count == 0) {
      return new uint[](0);
    }

    uint _idx = 0;
    uint[] memory res = new uint[](self.count);
    for (uint i = 0; i < self.list.length; i++) {
      if (self.list[i].flag == false) {
        continue;
      }
      if (_idx == self.count) {
        break;
      }

      res[_idx] = self.list[i].data;

      _idx = _idx.add(1);
    }

    return res;
  }
}