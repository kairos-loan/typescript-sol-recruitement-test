// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error WithdrawTransfer();

contract NFT is ERC721Enumerable {
    string public baseURI;
    uint256 public currentTokenId = 0;
    uint256 public constant TOTAL_SUPPLY = 10;
    uint256 public constant MINT_PRICE = 0.01 ether;

    constructor(string memory _name, string memory _symbol, string memory _baseURI) ERC721(_name, _symbol) {baseURI = _baseURI;}

    function mintTo(address recipient) public payable returns (uint256) {
        if (msg.value != MINT_PRICE) {revert MintPriceNotPaid();}
        uint256 newTokenId = ++currentTokenId;
        if (newTokenId > TOTAL_SUPPLY) {revert MaxSupply();}
        _safeMint(recipient, newTokenId);
        return newTokenId;
    }


    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        if (ownerOf(tokenId) == address(0)) {revert NonExistentTokenURI();}
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

}
