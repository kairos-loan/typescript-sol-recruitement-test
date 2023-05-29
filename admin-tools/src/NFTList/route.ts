import {Router, Request, Response} from "express";

import * as whiteListController from "./controller";
import {joiNFTSchema, joiNFTsSchema, joiNFTsSchema} from "./joi";
import httpError from "../errorManagement";


const listRoutes = Router();

export const getNftList = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const result = await whiteListController.getNftList();
    res.send(result);
  } catch (e) {
    console.error("Error while getting NFT list", e);
    next(e);
  }
};

const addNFTsToList = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const nftToAdd = req.body;
    try {
      await joiNFTsSchema.validateAsync(nftToAdd);
    } catch (e) {
      throw new httpError(400, `${e}`);
    }
    const result = await whiteListController.addNFTsToList(nftToAdd);
    res.send(result);
  } catch (e) {
    console.error("Error while adding an NFT to the list", e);
    next(e);
  }
};

const getProofForNft = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const {contract, id} = req.params;
    await joiNFTSchema.validateAsync({contract, id});
    const result = await whiteListController.getProofForNft(contract, +id);
    res.send(result);
  } catch (e) {
    console.error("Error while getting proof for NFT", e);
    next(e);
  }
}
const getSignedMerkleTree = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const result = await whiteListController.getSignedMerkleTree();
    res.send(result);
  } catch (e) {
    console.error("Error while getting proof for NFT", e);
    next(e);
  }
}

listRoutes.get("/:contract/:id", getProofForNft);
listRoutes.get("/tree", getSignedMerkleTree);
listRoutes.get("/", getNftList);
listRoutes.post("/", addNFTsToList);

export {listRoutes};