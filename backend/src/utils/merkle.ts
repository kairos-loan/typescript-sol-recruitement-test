import {MerkleTree} from 'merkletreejs';
import {keccak256} from 'viem';
import {NFTList} from "../NFTList/model";

const _encodeNFT = (contract: string, id: number): string => {
  return `${contract.toLowerCase()}${id}`;
}

const _hashMsg = (msg: string): string => {
  return keccak256(Buffer.from(msg));
}

function createTreeFromList(nftList: NFTList): any {
  let nftListFormatted = [];
  const nftContracts = Object.keys(nftList);
  nftContracts.forEach(contract => {
    const ids = nftList[contract];
    Object.keys(ids).forEach(id => {
      nftListFormatted.push(_encodeNFT(contract, +id));
    });
  });
  const leaves = nftListFormatted.map(_hashMsg);
  return new MerkleTree(leaves, keccak256, {sort: true});
}

function getMerkleProofForNFT(tree: any, contract: string, id: number): any {
  const nftFormatted = _encodeNFT(contract, id);
  const nftHash = _hashMsg(nftFormatted);
  const proof = tree.getHexProof(nftHash);
  const root = tree.getRoot().toString('hex');
  const isValidProof = tree.verify(proof, nftHash, root);

  if (!isValidProof) {
    throw new Error("Invalid Proof check !");
  }
  return proof;

}

// const proof = tree.getHexProof(leaves[0]);
// console.log("Proof for NFTA-1", proof);
//
// const isValidProof = tree.verify(proof, leaves[0], root);
// if (!isValidProof) {
//   console.log('The proof is not valid.');
//   return false;
// }

export {
  createTreeFromList,
  getMerkleProofForNFT,
}
