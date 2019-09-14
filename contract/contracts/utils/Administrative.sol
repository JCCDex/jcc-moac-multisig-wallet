pragma solidity 0.4.24;

contract Administrative {
  address public owner;
  address public administrator;

  constructor() public {
    owner = msg.sender;
    administrator = msg.sender;
  }

  modifier onlyPayloadSize(uint size) {
    require(msg.data.length >= size + 4, "data size is error");
    _;
  }

  modifier zeroAddress(address _addr) {
    require(_addr != address(0), "zero address invalid");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "only owner can modify this");
    _;
  }

  modifier onlyAdministrator {
    require(msg.sender == administrator, "only administrator can modify this");
    _;
  }

  modifier onlyPrivileged() {
    require((msg.sender == owner) || (msg.sender == administrator), "only owner or administrator can modify this");
    _;
  }

  function transferOwnership(address newOwner) public onlyOwner zeroAddress(newOwner){
    owner = newOwner;
  }

  function transferAdministrator(address newAdministrator) public onlyPrivileged zeroAddress(newAdministrator){
    administrator = newAdministrator;
  }
}