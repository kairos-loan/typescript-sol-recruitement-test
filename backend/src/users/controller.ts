import {getViemClient, getNFTContract, getWalletNFTBalance, getWalletStackedNFT} from "../utils/viemClient";
import * as NFTLIStController from "../NFTList/controller";
import httpError from "../errorManagement";

export async function getUserNFTBalance(wallet: string) {
  try {
    const walletNfts = {};
    const nftList = await NFTLIStController.getNftList();
    for (const nft of Object.keys(nftList)) {
      const userNFTBalance = await getWalletNFTBalance(wallet, nft);
      const formattedUserNFTBalance = userNFTBalance.map((nftData) => ({
        tokenId: nftData.tokenId,
        tokenURI: nftData.tokenURI,
        status: Object.keys(nftList[nft]).includes(nftData.tokenId + "") ? "stackable" : "unstackable",
      }));
      if (!walletNfts[nft]) walletNfts[nft] = [];
      walletNfts[nft].push(...formattedUserNFTBalance);
    }
    return walletNfts;
  } catch (e) {
    throw new httpError(500, `Error while getting user balance: ${e}`);
  }
}

export async function getUserStackedNFT(wallet: string) {
  try {
    const userStackedNfts = await getWalletStackedNFT(wallet);
    return userStackedNfts;
  } catch (e) {
    throw new httpError(500, `Error while getting user stacked nft: ${e}`);
  }
}