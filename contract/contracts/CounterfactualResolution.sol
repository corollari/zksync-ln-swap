// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CounterfactualResolution {
    IERC20 tBTContract = IERC20(0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa);
    address public partySellingLN;
    address public partyBuyingLN;
    uint public instantiationTime;
    bytes32 public paymentHash;
    uint constant claimDelay  = 1 days;

    constructor(address _partySellingLN, address _partyBuyingLN, bytes32 _paymentHash) public {
        partySellingLN = _partySellingLN;
        partyBuyingLN = _partyBuyingLN;
        instantiationTime = now;
        paymentHash = _paymentHash;
    }

    function claimBuyer(bytes memory preimage) public {
        require(sha256(preimage) == paymentHash, "Preimage doesn't match the payment hash");
        uint balance = tBTContract.balanceOf(address(this));
        tBTContract.transfer(partyBuyingLN, balance);
    }

    function claimSeller() public {
        require(now > (instantiationTime + claimDelay));
        uint balance = tBTContract.balanceOf(address(this));
        tBTContract.transfer(partySellingLN, balance);
    }
}