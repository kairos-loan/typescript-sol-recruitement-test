# Kairos-loan recruitement test for fullstack blockchain engineer

Fork this repo and implement following instructions. Send your repo link when you are finished.

Show your knowledge of best practices along the way.

We are testing your ability to create a fullstack dapp front + back + contract. Implement all code in a fork of this repo, front should start and be usable in one command.
Ideally, have the api and contract deployed and live.  

Imposed stack: next.js, foundry, rainbowkit, viem.sh.

This is an NFT staking app. The smart contract makes everything trustless.
An admin provides one list of NFTs eligible for staking (can be from multiple collections). The admin does not make an onchain transaction to provide the list, leverage the API to provide it, and cryptographic techniques so the contract assesses that only the admin has control on the list. This list can be changed without onchain transaction.

The NFT holder can use the front to see all the NFTs in her wallet, see the ones that are eligible to be staked, select one or multiple of them, and stake them. In another page, the user can see the NFTs she staked, how long they have been in the contract, and can unstake them.

Ideally, have an e2e test demonstarting it works in nominal conditions.

Don't worry if you choke on any part of this test (conception or implementation), but don't stay stuck, [reach out](https://t.me/t0bou) and we will unblock you, or implement what you can and circumvent the part you can't.

The overall quality of security, code clarity, UI/UX etc. matters to us.
