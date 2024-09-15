// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20 {
  address public token;

  constructor(string memory _name, string memory _symbol, address _token) ERC20(_name, _symbol){
    token = _token;
  }

  // Mint function restricted to the stablecoin contract
  function mint(address to, uint256 amount) public {
    require(token == msg.sender, "Only the stablecoin contract can mint tokens");
    _mint(to, amount);
  }
}