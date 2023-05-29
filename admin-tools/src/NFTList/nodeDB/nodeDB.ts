import {Config, JsonDB} from "node-json-db";
import {NFT, NFTList} from "../model";

const NFTWhiteListDB = new JsonDB(new Config("src/NFTList/nodeDB/NFTList", true, false, "/"));

async function addNFTsToList(nftToAdd: NFT[]): Promise<void> {
  for (const nft of nftToAdd) {
    await NFTWhiteListDB.push(`/${nft.contract}/${nft.id}`, true);
  }
}

async function getAllNFTContracts():Promise<NFTList> {
  return await NFTWhiteListDB.getData("/");
}

export {
  addNFTsToList,
  getAllNFTContracts,
}