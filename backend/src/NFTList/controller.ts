import * as nodeDBClient from "./nodeDB/nodeDB";
import httpError from "../errorManagement";
import {NFT, Signature, SignedMerkleTree} from "./model";
import {createTreeFromList, getMerkleProofForNFT} from "../utils/merkle";
import {bufferToHex, ecrecover, pubToAddress, toBuffer} from "ethereumjs-util";
import {getStackingAdmin} from "../utils/viemClient";
import {throws} from "assert";

export async function getStackingContract() {
  return process.env.STACKING_CONTRACT;
}


export async function updateMerkleTree(nftList: any, root: any, signature: any) {
  let stackingAdmin;
  try {
    stackingAdmin = await getStackingAdmin();
  } catch (e) {
    throw new httpError(500, `Error while getting stacking admin ${e}`);
  }
  // First check tree signature
  const rootBuffer = toBuffer(`0x${root}`);
  const rBuffer = toBuffer(`0x${signature.r}`);
  const sBuffer = toBuffer(`0x${signature.s}`);

  const signatureFormatted: Signature = {
    v: +signature.v,
    r: `0x${signature.r}`,
    s: `0x${signature.s}`
  };
  const signerPublicKey = ecrecover(rootBuffer, signatureFormatted.v, rBuffer, sBuffer).toString('hex');
  let addressSigner = bufferToHex(pubToAddress(Buffer.from(signerPublicKey, 'hex')));
  if (addressSigner !== stackingAdmin.toLowerCase()) throw new httpError(400, `Root not signed by admin`);
  // Second reconstruct tree from the list
  const generatedRoot = (createTreeFromList(nftList)).getRoot().toString('hex');
  if (generatedRoot !== root) throw new httpError(400, `Root does not match NFT list`);
  await nodeDBClient.deleteNFTList().catch((e) => {throw new httpError(500, `Error while deleting NFT list: ${e}`);});
  await nodeDBClient.createNFTList(nftList).catch((e) => {throw new httpError(500, `Error while creating NFT list: ${e}`);});
  await nodeDBClient.storeSignatureForTree(signatureFormatted, root).catch((e) => {throw new httpError(500, `Error storing signature: ${e}`);});
  return {nftList, root, signature};
}


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

// export async function getSignedMerkleTree(): Promise<SignedMerkleTree> {
export async function getSignedMerkleTree(): Promise<Signature> {
  try {
    const signedTree = await nodeDBClient.getSignature();
    return signedTree;
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
