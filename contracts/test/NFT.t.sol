// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    NFT public nft;
    address recipient;

    function setUp() public {
        recipient = address(0x123);
        nft = new NFT("MyNFT", "NFT", "https://my-nft.com/");
    }

    function test_MintTo() public {
        uint256 expectedTokenId = 1;
        uint256 actualTokenId = nft.mintTo{value: 0.01 ether}(recipient);

        assertEq(actualTokenId, expectedTokenId, "Token ID does not match");
        assertEq(nft.ownerOf(expectedTokenId), recipient, "Owner does not match");
        assertEq(nft.balanceOf(recipient), 1, "Balance does not match");
    }

    function test_MintToMaxSupply() public {
        for (uint i = 0; i < 10; i++) {
            nft.mintTo{value: 0.01 ether}(recipient);
        }
        assertEq(nft.balanceOf(recipient), 10, "Should hold 10 NFT");
    }

    function test_MintBeyondMaxSupplyShouldFail() public {
        for (uint i = 0; i < 10; i++) {
            nft.mintTo{value: 0.01 ether}(recipient);
        }
        vm.expectRevert(MaxSupply.selector);
        nft.mintTo{value: 0.01 ether}(recipient);
    }

    function test_TokenURI() public {
        uint256 tokenId = nft.mintTo{value: 0.01 ether}(recipient);
        string memory expectedURI = "https://my-nft.com/1";
        string memory actualURI = nft.tokenURI(tokenId);
        assertEq(actualURI, expectedURI, "Token URI does not match");
    }

    function test_Transfer() public {
        vm.startPrank(recipient);
        vm.deal(recipient, 1 ether);
        address receiver = address(0x321);
        nft.mintTo{value: 0.01 ether}(recipient);
        assertEq(nft.balanceOf(recipient), 1, "Balance does not match");
        nft.transferFrom(recipient, receiver, 1);
        assertEq(nft.balanceOf(receiver), 1, "Balance of receiver should be one");
        vm.stopPrank();
    }
}
