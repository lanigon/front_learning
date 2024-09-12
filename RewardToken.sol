// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20 {

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol){
        // No initial supply, reward tokens are minted through staking
    }

    // Mint function restricted to the stablecoin contract
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}