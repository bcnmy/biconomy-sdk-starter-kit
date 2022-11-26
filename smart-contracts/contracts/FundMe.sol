pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./interfaces/IERC20WithDecimals.sol";

contract FundMe {
    mapping(address => mapping(address => uint256)) balances;

    address private constant NATIVE_TOKEN_ADDRESSS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    event TokenPulled(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    function balanceOf(address account, address tokenAddress) external view returns (uint256) {
        return balances[account][tokenAddress];
    }

    function pullTokens(address tokenAddress, uint256 amount) external returns (uint256) {
        require(amount != 0, "Amount should not be 0");
        require(tokenAddress != address(0),"tokenAddress cannot be ZERO_ADDRESS");

        SafeERC20Upgradeable.safeTransferFrom(
            IERC20WithDecimals(tokenAddress),
            msg.sender,
            address(this),
            amount
        );

        balances[msg.sender][tokenAddress] += amount;

        // Notify off-chain applications of the transfer.
        emit TokenPulled(msg.sender, address(this), amount);
    }

    receive() external payable {
        balances[msg.sender][NATIVE_TOKEN_ADDRESSS] += msg.value;
    }
}