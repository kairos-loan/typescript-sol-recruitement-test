import {Router, Request, Response} from "express";

import * as listController from "./controller";
import {joiNFTSchema, joiNFTsSchema, joiNFTsSchema} from "./joi";

const listRoutes = Router();

export const getNftList = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const result = await listController.getNftList();
    res.send(result);
  } catch (e) {
    console.error("Error while getting NFT list", e);
    next(e);
  }
};

const updateMerkleTree = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const { nftList, root, signature } = req.body;
    // TO DO VALIDATION

    // try {
    //   await joiNFTsSchema.validateAsync(nftToAdd);
    // } catch (e) {
    //   throw new httpError(400, `${e}`);
    // }

    const result = await listController.updateMerkleTree(nftList, root, signature);
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
    const result = await listController.getProofForNft(contract, +id);
    res.send(result);
  } catch (e) {
    console.error("Error while getting proof for NFT", e);
    next(e);
  }
}
const getSignedMerkleTree = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const result = await listController.getSignedMerkleTree();
    res.send(result);
  } catch (e) {
    console.error("Error while getting proof for NFT", e);
    next(e);
  }
}
const getStackingContract = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const result = await listController.getStackingContract();
    res.send(result);
  } catch (e) {
    console.error("Error while getting stacking contract", e);
    next(e);
  }
}


listRoutes.get("/:contract/:id", getProofForNft);
listRoutes.get("/stacking", getStackingContract);
listRoutes.get("/tree", getSignedMerkleTree);
listRoutes.get("/", getNftList);
listRoutes.post("/", updateMerkleTree);
export {listRoutes};