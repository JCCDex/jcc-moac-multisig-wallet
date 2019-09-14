pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

library GoodERC20 {
  function isContract(address addr) internal view {
    assembly {
      if iszero(extcodesize(addr)) { revert(0, 0) }
    }
  }

  function handleReturnData(address _erc20Addr, bytes memory _msg) internal returns (bool result) {
    //_erc20Addr.call(_msg);
    uint msgSize = _msg.length;
    // _erc20Addr.call(_msg);
    assembly {
      if iszero(call(gas(), _erc20Addr, 0, add(_msg, 0x20), msgSize, 0x00, 0x20)){
        revert(0, 0)
      }
      switch returndatasize()
      case 0 { // not a std erc20
        result := 1
      }
      case 32 { // std erc20
        returndatacopy(0, 0, 32)
        result := mload(0)
      }
      default { // anything else, should revert for safety
        revert(0, 0)
      }
    }
  }

  function safeTransfer(address _erc20Addr, address _to, uint256 _value) internal returns (bool result) {
    // Must be a contract addr first!
    isContract(_erc20Addr);

    bytes memory _msg = abi.encodeWithSignature("transfer(address,uint256)", _to, _value);

    // handle returndata
    return handleReturnData(_erc20Addr, _msg);
  }

  function safeTransferFrom(address _erc20Addr, address _from, address _to, uint256 _value) internal returns (bool result) {
    // Must be a contract addr first!
    isContract(_erc20Addr);

    // call return false when something wrong
    // require(_erc20Addr.call(bytes4(keccak256("transferFrom(address,address,uint256)")), _from, _to, _value));
    bytes memory _msg = abi.encodeWithSignature("transferFrom(address,address,uint256)", _from, _to, _value);

    // handle returndata
    return handleReturnData(_erc20Addr, _msg);
  }
}
