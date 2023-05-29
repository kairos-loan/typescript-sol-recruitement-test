## Smart Contracts

## How to use
https://book.getfoundry.sh/getting-started/installation

`cp .env-example .env `

Update the .env accordingly

### Overview

This project is composed of two contracts, one standard NFT ERC721 and one stacking Contract.
The stacking contract only allow certain NFT to be stacked.

The admin create a Merkle Tree where all the leafs represent an NFT with an Id and to stack an NFT in the contract a valid Merkle Proof is Mandatory.
To update the list the admin just need to create and sign a new Merkle Tree.

### Useful command

``forge build`` Compile the contracts

``forge script script/NFT.s.sol:MyScript --fork-url http://localhost:8545 --broadcast`` Deploy the contracts on local blockchain.

``forge test`` Run the test for the contracts