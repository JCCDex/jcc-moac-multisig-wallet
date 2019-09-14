pragma solidity 0.4.24;

import "../utils/SafeMath.sol";
import "../utils/GoodERC20.sol";

// 定义一个调用ERC20的合约
contract MockSafeTransfer {

  function transfer(address _token, address _to, uint _amount) public returns (bool) {
    require(GoodERC20.safeTransfer(_token, _to, _amount), "transfer error");
  }

  function transferFrom(address _token, address _from, address _to, uint _amount) public {
    require(GoodERC20.safeTransferFrom(_token, _from, _to, _amount), "transfer error");
  }
}
