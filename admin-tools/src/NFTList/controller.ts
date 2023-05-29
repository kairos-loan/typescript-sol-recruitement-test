import * as nodeDBClient from "./nodeDB/nodeDB";
import httpError from "../errorManagement";
import {NFT, SignedMerkleTree} from "./model";
import {createTreeFromList, getMerkleProofForNFT} from "../utils/merkle";
import {ecsign, toBuffer} from "ethereumjs-util";

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

export async function getProofForNft(contract: string, id: number) {
  const nftList = await (nodeDBClient.getAllNFTContracts());
  const tree = createTreeFromList(nftList);
  try {
    const proof = getMerkleProofForNFT(tree, contract, id);
    return proof;
  } catch (e) {
    throw new httpError(400, `Error while generating proof for ${contract}/${id}: ${e}`);
  }
}

export async function getSignedMerkleTree(): Promise<SignedMerkleTree> {
  try {
    const nftList = await (nodeDBClient.getAllNFTContracts());
    const tree = createTreeFromList(nftList);
    const root = tree.getRoot().toString('hex');
    const signatureSimplified = ecsign(toBuffer(`0x${root}`), toBuffer(ADMIN_PRIVATE_KEY));
    const v = signatureSimplified.v.toString();
    const r = signatureSimplified.r.toString('hex');
    const s = signatureSimplified.s.toString('hex');
    return {root, signature: {v, r, s}}
  } catch (e) {
    throw new httpError(500, `Error while getting signed Merkle Tree ${e}`);
  }
}


export async function getNftList() {
  try {
    return await (nodeDBClient.getAllNFTContracts());
  } catch (e) {
    throw new httpError(500, `Error while getting NFT List: ${e}`);
  }
}

export async function addNFTsToList(nftToAdd: NFT[]): Promise<NFT[]> {
  try {
    await (nodeDBClient.addNFTsToList(nftToAdd));
    return nftToAdd;
  } catch (e) {
    throw new httpError(500, `Error while adding NFTs to the list: ${e}`);
  }
}
