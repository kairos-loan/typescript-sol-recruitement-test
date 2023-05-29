// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NFT.sol";
import "../src/Stacking.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        address stackingAdmin = address(0x90f94468ad9842C7b5706e09d3d204874eE6D6c0);
        address stackingUser = address(0x9DAd0B9B4de12385FcfaE0eBBA12d41b9cD49A7A);
        NFT nft = new NFT("WaifNFT", "WNFT", "https://bafybeid3qilopca23ua54ei2n4e2tha3bmvlutbi6qbgkcw3x7y6w3lsbq.ipfs.nftstorage.link/");
        NFT nftBis = new NFT("WaifNFTBis", "WNFTB", "https://bafybeid3qilopca23ua54ei2n4e2tha3bmvlutbi6qbgkcw3x7y6w3lsbq.ipfs.nftstorage.link/");
        Stacking stacking = new Stacking(stackingAdmin);
        nft.mintTo{value: 0.01 ether}(stackingUser);
        for (uint i = 0; i < 5; i++) {
            nft.mintTo{value: 0.01 ether}(stackingUser);
        }
        for (uint i = 0; i < 5; i++) {
            nftBis.mintTo{value: 0.01 ether}(stackingUser);
        }
        vm.stopBroadcast();
    }
}


//forge script script/NFT.s.sol:MyScript --fork-url http://localhost:8545 --broadcast
