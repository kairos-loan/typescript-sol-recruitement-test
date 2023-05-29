// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";

    error invalidNFTOwner();
    error InvalidSigner();
    error InvalidProof();
    error InvalidApproval();
    error InvalidStackingAmount();

contract Stacking {
    address public admin;
    bytes32 public merkleRoot;

    event NFTStacked(address indexed user, uint256 indexed tokenId);
    event NFTUnstacked(address indexed user, uint256 indexed tokenId);


    struct StackedNFT {
        address owner;
        uint256 stackedTimestamp;
    }

    struct NFTIdentifier {
        uint256 stackedTimestamp;
        address contractAddress;
        uint256 id;
    }

    mapping(address => NFTIdentifier[]) public userNFTs;
    mapping(address => mapping(uint256 => StackedNFT)) public nftStacked;


    constructor(address _admin) {
        admin = _admin;
    }

    function getWalletNFTs(address _address) public view returns (NFTIdentifier[] memory) {
        return userNFTs[_address];
    }

    function checkSig(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool isValid){
        address recover = ecrecover(hash, v, r, s);
        isValid = recover == signer;
    }

    function encodeNFTID(address nft, uint8 id) public pure returns (string memory) {
        string memory nftString = Strings.toHexString(nft);
        string memory idString = Strings.toString(id);
        string memory nftWithId = string(abi.encodePacked(nftString, idString));
        return nftWithId;
    }

    function verifyMerkle(
        address nft,
        uint8 id,
        bytes32[] calldata proof,
        bytes32 merkleRoot,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bool) {
        if (!checkSig(admin, merkleRoot, v, r, s)) {revert InvalidSigner();}
        string memory nftWithId = encodeNFTID(nft, id);
        bytes32 leaf = keccak256(abi.encodePacked(nftWithId));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function stackNFT(address nftAddress, uint8 id, bytes32[] calldata proof, bytes32 merkleRoot, uint8 v, bytes32 r, bytes32 s) public {
        IERC721Enumerable nftContract = IERC721Enumerable(nftAddress);
        if (nftContract.ownerOf(id) != msg.sender) {revert invalidNFTOwner();}
        if (!(nftContract.getApproved(id) == address(this)) || nftContract.isApprovedForAll(msg.sender, address(this))) {revert InvalidApproval();}
        if (!verifyMerkle(nftAddress, id, proof, merkleRoot, v, r, s)) {revert InvalidProof();}
        nftContract.transferFrom(msg.sender, address(this), id);
        nftStacked[nftAddress][id] = StackedNFT({owner: msg.sender, stackedTimestamp: block.timestamp});
        userNFTs[msg.sender].push(NFTIdentifier(block.timestamp, nftAddress, id));
        emit NFTStacked(msg.sender, id);
    }

    function withdrawNFT(address nftAddress, uint256 id) public {
        StackedNFT memory stackedNFT = nftStacked[nftAddress][id];
        if (stackedNFT.owner != msg.sender) {
            revert invalidNFTOwner();
        }
        IERC721Enumerable nftContract = IERC721Enumerable(nftAddress);
        nftContract.transferFrom(address(this), msg.sender, id);
        delete nftStacked[nftAddress][id];
        // Not optimal would be better to remove and add of chain indexer
        NFTIdentifier[] storage userNfts = userNFTs[msg.sender];
        for (uint i = 0; i < userNfts.length; i++) {
            if (userNfts[i].contractAddress == nftAddress && userNfts[i].id == id) {
                userNfts[i] = userNfts[userNfts.length - 1];
                userNfts.pop();
                break;
            }
        }
        emit NFTUnstacked(msg.sender, id);
    }

}
