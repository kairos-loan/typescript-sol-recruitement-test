import {Router, Request, Response} from "express";
import * as userController from "./controller";
import httpError from "../errorManagement";

const userRoutes = Router();

export const getUserNFTBalance = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const {wallet} = req.params;
    const result = await userController.getUserNFTBalance(wallet);
    res.send(result);
  } catch (e) {
    console.error("Error while getting NFT list", e);
    next(e);
  }
};

export const getUserStackedNFT = async (req: Request, res: Response<any>, next: Function) => {
  try {
    const {wallet} = req.params;
    const result = await userController.getUserStackedNFT(wallet);
    res.send(result);
  } catch (e) {
    console.error("Error while getting NFT list", e);
    next(e);
  }
};

userRoutes.get("/:wallet/nfts", getUserNFTBalance);
userRoutes.get("/:wallet/stacked", getUserStackedNFT);
export default userRoutes;