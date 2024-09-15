// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RewardToken.sol"; // Import the RewardToken contract

contract MyStablecoin is ERC20 {
    mapping(address => uint256) public stakedBalances; // Track staked balances
    RewardToken public rewardToken; // Reference to the reward token contract

    // Constructor takes arguments for name, symbol, and initial supply
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply); // Mint initial supply to contract deployer
    }

    function setRewardToken(address _rewardTokenAddress) public {
        rewardToken = RewardToken(_rewardTokenAddress);
    }

    // Mint new tokens
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Not enough tokens");

        // Transfer tokens from sender to contract for staking
        _transfer(msg.sender, address(this), amount);
        stakedBalances[msg.sender] += amount; // Update staked balance

        // Mint new reward tokens in a 1:1 ratio (can be adjusted)
        rewardToken.mint(msg.sender, amount);
    }

    function getStakedBalance(address account) public view returns (uint256) {
        return stakedBalances[account];
    }

    function unstake(uint256 amount) public {
        require(
            stakedBalances[msg.sender] >= amount,
            "Insufficient staked balance"
        );

        stakedBalances[msg.sender] -= amount; // Reduce staked balance
        rewardToken._transfer(address(this), msg.sender, amount); // Return staked tokens
    }
}
