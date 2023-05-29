## Admin-tools

This repo contains the backend and is intended to be use by the frontend.


### How to run

`npm i `

`cp .env-example .env `

Update the variables in .env accordingly

`npm run dev`

### Exposed routes

`GET /nfts/:contract/:id`
Generate a merkle proof if the provided NFT contract and ID are in the list

`GET /nfts/tree`
Get the MerkelRoot with its signature

`GET /users/:wallet/nfts`
Get the list of the users NFT balance as well are their status (Stackable | Unstackable).

`GET /users/:wallet/stacked`
Get the list of the NFT stacked in the contract for a wallet.

`GET /nfts/`
Return the list of approved NFTs.

`GET /nfts/stacking`
Return address of the stacking contract.

`POST /nfts/`
Update the Merkle Tree in the backend. This endpoint is use by the admin to update the list of approved NFT by sending a signed MerkleTree root along the list.
If the signature is not correct the tree will not be added.

Payload Example:
```
{
    "nftList": {
        "0xddf24cc2eb7e1c56c9cc2ccb1ccb1e288994a4a5": {
            "1": true,
            "2": true
        },
        "0x1fe1d64f0d0fb947aaadf49d2e4046b6c508fa5a": {
            "1": true,
            "2": true
        }
    },
    "root": "c80bd1929e8953e355d9b7e7c65c07636ab5b4682bca6c0db2017fca0d0b928d",
    "signature": {
        "v": "28",
        "r": "87a832b91bc68697969dee678d1b1e73fd2ac33716c97ca60f61cfb619a66dfa",
        "s": "00955d5c27c9b53e66693b6861ed586b3d558c139b5f20be514d676e0a6d944a"
    }
}
```
