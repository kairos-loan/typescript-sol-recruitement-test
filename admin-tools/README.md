## Admin-tools

This repo is intended to facilitate the admin tasks of creating and signing a list of NFT open to stacking.

It should NOT BE DEPLOYED.


### How to run

`npm i `

`cp .env-example .env `

Update the variables in .env accordingly

`npm run dev`

### Exposed routes

`GET /nfts/tree`
Generate and return the merkle tree of the NFT List with the admin signature

`GET /nfts/`
Return the list of approved NFTs

`POST /nfts/`
Add on or multiple NFT to the list.
Payload Example:
```
[
    {
        "id": 1,
        "contract": "0x1fe1d64f0d0fb947aaadf49d2e4046b6c508fa5a"
    },
    {
        "id": 2,
        "contract": "0x1fe1d64f0d0fb947aaadf49d2e4046b6c508fa5a"
    }
]
```

### Script Folder
This Folder contains script to generate private keys and merkle tree used for testing the contracts.