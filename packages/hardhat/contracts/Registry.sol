pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Identity.sol";

contract Registry {
    address public identityContract;

    event IdentityCreated(
        address identity,
        address[] owners,
        uint256[] equities,
        address creator
    );

    constructor() payable {
        identityContract = address(new Identity());
    }

    function create(address[] calldata _owners, uint256[] calldata _equities)
        public
        returns (address)
    {
        Identity identity = Identity(payable(Clones.clone(identityContract)));
        emit IdentityCreated(address(identity), _owners, _equities, msg.sender);
        identity.initialize((_owners), _equities);
        return address(identity);
    }

    receive() external payable {}

    fallback() external payable {}
}
