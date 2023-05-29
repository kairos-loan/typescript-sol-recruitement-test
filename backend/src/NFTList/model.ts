export type NFT = {
  contract: string,
  id: number,
};

export type Signature = {
  v: number,
  r: string,
  s: string
}

export type NFTList = {
  [contract: string]: {
    [id: string]: boolean;
  };
};

export interface SignedMerkleTree {
  root: string;
  signature: string;
  r: string;
  s: string;
}