// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

struct NFT {
    EIP721 contract; // missing import on purpose
    uint256 tokenId;
}

interface Test {
    /// @notice stores the NFT and who signed `signature`
    /// @dev whenerver this function is called, give an id to the nft and store its info in a mapping
    /// @param nft the nft to store
    /// @param signature EIP-712 signature of the `nft` argument
    /// @param signerIsOwner true if the signer of `signature` is the owner of `nft`
    function storeNFT(NFT calldata nft, bytes calldata signature) external returns (bool signerIsOwner);

    /// @notice increase of `msg.value` the deposit amount for `nft`
    /// @param nft the nft that should increase its total deposit
    function deposit(NFT calldata nft) external payable;
}