// This is a Solidity smart contract that allows for secure transfer of ERC20 tokens
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Import relevant OpenZeppelin libraries
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MetaTokenSender {
    using ECDSA for bytes32;

    // Create a mapping to track executed signatures
    mapping(bytes32 => bool) private executedSignatures;

    // Add a nonce parameter to the transfer function for added security
    function transferWithNonce(
        address sender,
        uint256 amount,
        address recipient,
        address tokenContract,
        uint256 nonce,
        bytes memory signature
    ) public {
        // Hash the transfer details to generate a unique message hash
        bytes32 messageHash = getMessageHash(
            sender,
            amount,
            recipient,
            tokenContract,
            nonce
        );
        bytes32 signedMessageHash = messageHash.toEthSignedMessageHash();

        // Check that this signature has not already been executed
        require(
            !executedSignatures[signedMessageHash],
            "Signature already executed"
        );

        // Recover the address of the signer using the provided signature
        address signer = signedMessageHash.recover(signature);

        // Check that the signer is the same as the sender
        require(signer == sender, "Invalid signature");

        // Mark this signature as executed
        executedSignatures[signedMessageHash] = true;

        // Transfer the tokens from the sender to the recipient
        bool sent = ERC20(tokenContract).transferFrom(
            sender,
            recipient,
            amount
        );
        require(sent, "Transfer failed");
    }

    // Generate a unique hash for the transfer details
    function getMessageHash(
        address sender,
        uint256 amount,
        address recipient,
        address tokenContract,
        uint256 nonce
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    sender,
                    amount,
                    recipient,
                    tokenContract,
                    nonce
                )
            );
    }
}
