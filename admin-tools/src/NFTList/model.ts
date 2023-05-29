export type NFT = {
  contract: string,
  id: number,
};

export type NFTList = {
  [contract: string]: {
    [id: string]: boolean;
  };
};

export interface SignedMerkleTree {
  root: string;
  signature: {
    v: string;
    r: string;
    s: string;
  };

}