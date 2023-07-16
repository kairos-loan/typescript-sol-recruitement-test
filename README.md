# Kairos-loan recruitement test for fullstack blockchain engineer

Fork this repo and implement following instructions. Send your repo link when you are finished.

Show your knowledge of best practices along the way.

We are testing your ability to create a fullstack dapp front + back + contract. Implement all code in a fork of this repo, the whole app should start and be usable in one command.
Ideally, have the api and contract deployed and live.  

Imposed stack: next.js, foundry, rainbowkit, viem.sh.

This is an NFT staking app. The smart contract makes everything trustless.
An admin provides one list of NFTs eligible for staking (can be from multiple collections, e.g [cryptopunk #1, cryptopunk #12, #bored ape #3]). The admin does not make an onchain transaction to provide the list, leverage the API to provide it, and cryptographic techniques so the contract assesses that only the admin has control on the list. This list can be changed without onchain transaction. The contract must be able to handles a list arbitrarly large.
For obvious reasons, no private key should be sent on internet (The API must not know the private key either).

The NFT holder can use the front to see all the NFTs in her wallet, see the ones that are eligible to be staked, select one or multiple of them, and stake them (I.e the contract helds the NFTs in custody, no extra step required). In another page, the user can see the NFTs she staked, how long they have been in the contract, and can unstake them.
You can deploy mock token contracts and use any EVM network you want.

Ideally, have an e2e test demonstarting it works in nominal conditions.

Don't worry if you choke on any part of this test (conception or implementation), but don't stay stuck, [reach out](https://t.me/t0bou) and we will unblock you, or implement what you can and circumvent the part you can't. On top of your ability to implement a solution, we are testing how you make technical choices and how you architecture your solution, it is recommended that you validate with us on telegram your choices and your understanding of the subject so you don't implement an app off topic.

The overall quality of security, code clarity, UI/UX etc. matters to us.
