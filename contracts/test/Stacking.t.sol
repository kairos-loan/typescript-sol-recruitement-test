// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/NFT.sol";
import "../src/Stacking.sol";

contract StackingTest is Test {
    NFT public nftA;
    NFT public nftB;
    NFT public nftC;
    Stacking public stacking;
    address recipient;
    address malicious;
    address stackingAdmin;

    function setUp() public {
        //772aa31804bb89c31606610ab0682020f97ef581ad3b8742b8898a8218de8864
        stackingAdmin = address(0x41A25848331c2927632729d3fDD58C5EC7354212); // Match the private Keys
        vm.deal(stackingAdmin, 1 ether);
        vm.startPrank(stackingAdmin);
        recipient = address(0x123);
        malicious = address(0x321);
        stacking = new Stacking(stackingAdmin);
        nftA = new NFT("NFT A", "NFTA", "https://my-nft.com/");
        nftB = new NFT("NFT B", "NFTB", "https://my-nft.com/");
        nftC = new NFT("NFT C", "NFTC", "https://my-nft.com/");
        for (uint i = 0; i < 10; i++) {
            nftA.mintTo{value: 0.01 ether}(recipient);
            nftB.mintTo{value: 0.01 ether}(recipient);
            nftC.mintTo{value: 0.01 ether}(recipient);
        }
        //                console.log(address(nftA));
        //                console.log(address(nftB));
        //                console.log(address(nftC));
        vm.stopPrank();
    }

    function test_signature() public {
        // Generate with backend script>generateMerkleForTest.mjs
        bytes32 treeRoot = 0x0c398a28b924d13e175a07649f62be88a2655a81fdcd06271a9dba29fa64c5e5;
        uint8 v = 28;
        bytes32 r = 0x5c4c95eb5853a636f581f86234420dea4e043f0cf6381db0f4b362b046a2c3e3;
        bytes32 s = 0x6ea861f5c2112cc5781198769d7d98a66120ef789afd79ca1029f235ec25d839;
        bool isValid = stacking.checkSig(stackingAdmin, treeRoot, v, r, s);
        assertEq(isValid, true, "Signature is not valid !");
    }


    // Formatting bytes32[1] -> bytes32[]
    function _getBytes32ArrayForInput() pure public returns (bytes32[] memory) {
        bytes32[] memory b32Arr = new bytes32[](2);
        b32Arr[0] = 0x5e844316dd6126555c2f38e187daa02042c3006c0c7cacdb163cfc27322fb8cf;
        b32Arr[1] = 0xb7a68a3c2f4a39cb86b43fa23822830906e5676c5b199d31bdcbff917ce299b0;
        return b32Arr;
    }

    function test_NftIdEncoding() public {
        string memory nftIdEncoded = stacking.encodeNFTID(
            0xcF0e5f9345751A3Dc76a9ec1EC7593ac1A08615d,
            1
        );
        assertEq(nftIdEncoded, "0xcf0e5f9345751a3dc76a9ec1ec7593ac1a08615d1", "Encoding is not valid");
    }

    function test_MerkleProof() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();

        bool proofValid = stacking.verifyMerkle(
            0xcF0e5f9345751A3Dc76a9ec1EC7593ac1A08615d,
            1,
            proof,
            merkleRoot,
            v, r, s
        );
        assertEq(proofValid, true, "Proof is not valid");
    }


    function test_IncorrectMerkleRootShouldThrowSignatureError() public {
        bytes32 invalidMerkleRoot = 0xe32ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();

        vm.expectRevert(InvalidSigner.selector);
        stacking.verifyMerkle(
            0xcF0e5f9345751A3Dc76a9ec1EC7593ac1A08615d,
            1,
            proof,
            invalidMerkleRoot,
            v, r, s
        );
    }

    function test_NFTNotInTreeShouldReturnFalse() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();

        bool proofValid = stacking.verifyMerkle(
            0xcF0e5f9345751A3Dc76a9ec1EC7593ac1A08615d,
            99,
            proof,
            merkleRoot,
            v, r, s
        );
        assertEq(proofValid, false, "Should be false !");
    }

    function test_StackAnNFT() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();
        vm.startPrank(recipient);
        nftA.approve(address(stacking), 1);
        stacking.stackNFT(address(nftA), 1, proof, merkleRoot, v, r, s);
        address nftOwner = nftA.ownerOf(1);
        assertEq(nftOwner, address(stacking), "Stacking should own the NFT");
        vm.stopPrank();
    }

    function test_StackAnNFTWithInvalidOwnerShouldFail() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();
        vm.startPrank(malicious);
        vm.expectRevert(invalidNFTOwner.selector);
        stacking.stackNFT(address(nftA), 1, proof, merkleRoot, v, r, s);
        vm.stopPrank();
    }

    function test_StackAnNFTAndWithdraw() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();
        vm.startPrank(recipient);
        nftA.approve(address(stacking), 1);
        stacking.stackNFT(address(nftA), 1, proof, merkleRoot, v, r, s);
        address nftOwner = nftA.ownerOf(1);
        assertEq(nftOwner, address(stacking), "Stacking should own the NFT");
        stacking.withdrawNFT(address(nftA), 1);
        address walletNftOwner = nftA.ownerOf(1);
        assertEq(walletNftOwner, address(recipient), "Recipient should own the NFT");
        vm.stopPrank();
    }

    function test_StackAnNFTAndWithdrawWithWrongOwnerShouldFail() public {
        bytes32 merkleRoot = 0xe82ed0f7bf8e60ed506b6acda4f74e257c6745bf6a9ad356dc026454d0b8f7e8;
        uint8 v = 27;
        bytes32 r = 0x32d76fff9654274692c6628681f0cfef053d5da4060af56dbf48ae489d2cfaf0;
        bytes32 s = 0x52c27461b2b3a54df5025a35b1d2d80bd6e45393eda97865f4700c0f8b14823d;
        bytes32[] memory proof = _getBytes32ArrayForInput();
        vm.startPrank(recipient);
        nftA.approve(address(stacking), 1);
        stacking.stackNFT(address(nftA), 1, proof, merkleRoot, v, r, s);
        address nftOwner = nftA.ownerOf(1);
        assertEq(nftOwner, address(stacking), "Stacking should own the NFT");
        vm.startPrank(malicious);
        vm.expectRevert(invalidNFTOwner.selector);
        stacking.withdrawNFT(address(nftA), 1);
        vm.stopPrank();
    }

}
