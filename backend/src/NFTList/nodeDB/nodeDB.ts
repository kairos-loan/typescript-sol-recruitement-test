import {Config, JsonDB} from "node-json-db";
import {NFT, NFTList, Signature} from "../model";

const NFTWhiteListDB = new JsonDB(new Config("src/NFTList/nodeDB/NFTList", true, false, "/"));

async function storeSignatureForTree(signature: Signature, root: string) {
  await NFTWhiteListDB.push(`/tree/`, { ...signature, root });
}

async function getSignature(): Promise<Signature> {
  return await NFTWhiteListDB.getData(`/tree/`);
}
async function createNFTList(nftList: NFTList): Promise<void> {
  for (const nft of Object.keys(nftList)) {
    const nftIds = nftList[nft];
    for (const id of Object.keys(nftIds)) {
      await NFTWhiteListDB.push(`/nft/${nft}/${id}`, true);
    }
  }
}
async function deleteNFTList(): Promise<void> {
    await NFTWhiteListDB.delete('/nft/');
}

async function getAllNFTContracts():Promise<NFTList> {
  return await NFTWhiteListDB.getData("/nft/");
}

export {
  getSignature,
  storeSignatureForTree,
  createNFTList,
  deleteNFTList,
  getAllNFTContracts,
}