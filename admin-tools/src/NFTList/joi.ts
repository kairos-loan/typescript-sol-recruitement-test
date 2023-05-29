import * as Joi from "joi";
import {NFT} from "./model";

type typeNFT = {
  [alias in keyof NFT]: Joi.AnySchema;
};

const joiNFT: typeNFT = {
  contract: Joi.string().required(),
  id: Joi.number().required(),
};

export const joiNFTsSchema = Joi.array().items(Joi.object(joiNFT));
export const joiNFTSchema = Joi.object(joiNFT);
