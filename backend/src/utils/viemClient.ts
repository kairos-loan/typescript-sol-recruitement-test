import {Address, createPublicClient, getContract, http} from 'viem'
import {localhost, goerli} from 'viem/chains'
import {NFTABI} from "../assets/NFTAbi"
import {STACKINGABI} from "../assets/StackingABI";

let instance = null;
let instanceStacking = null;
let stackingAdmin = null;
let contractsCache = {};
const STACKING_CONTRACT = process.env.STACKING_CONTRACT;

export function getViemClient() {
  const isLocal = process.env.CHAIN === "LOCAL";
  if (!instance) {
    instance = createPublicClient({
      batch: {
        multicall: true,
      },
      chain: isLocal ? localhost : goerli,
      transport: http(),
    });
  }
  return instance;
}

export function getNFTContract(contractAddress: string) {
  if (contractsCache[contractAddress]) return contractsCache[contractAddress];
  else {
    const client = getViemClient();
    const contract = getContract({
      publicClient: client,
      address: contractAddress as Address,
      abi: NFTABI,
    });
    contractsCache[contractAddress] = contract;
    return contract;
  }
}

export function getStackingContract() {
  if (!instanceStacking) {
    const client = getViemClient();
    instanceStacking = getContract({
      publicClient: client,
      address: STACKING_CONTRACT as Address,
      abi: STACKINGABI,
    });
  }
  return instanceStacking;
}

export async function getStackingAdmin() {
  if (!stackingAdmin) {
    const stackingContract = await getStackingContract();
    stackingAdmin = (await stackingContract.read.admin());
  }
  return stackingAdmin;
}

export async function getWalletNFTBalance(wallet: string, nftAddress: string) {
  const ownedNFTs = [];
  const nftContract = getNFTContract(nftAddress);
  const walletBalance = +(await nftContract.read.balanceOf([wallet])).toString(10);
  if (walletBalance) {
    for (let i = 0; i < walletBalance; i++) {
      const tokenId = await nftContract.read.tokenOfOwnerByIndex([wallet, i]);
      const tokenURI = await nftContract.read.tokenURI([tokenId.toString(10)]);
      ownedNFTs.push({tokenId: tokenId.toString(10), tokenURI});
    }
  }
  return ownedNFTs;
}

function _mapUserStackedNFT(nftStacked: { stackedTimestamp: bigint, contractAddress: string, id: bigint, tokenURI: string }) {
  const date = new Date(Number(nftStacked.stackedTimestamp * BigInt(1000)));
  return {
    stackDate: date.toLocaleString(),
    contractAddress: nftStacked.contractAddress,
    id: nftStacked.id.toString(10),
    tokenURI: nftStacked.tokenURI,
  }
}


export async function getWalletStackedNFT(wallet: string) {
  const stackingContract = getStackingContract();
  const userStackedNFT = await stackingContract.read.getWalletNFTs([wallet]);
  const userStackedNFTWithURI = []
  for (const nft of userStackedNFT) {
    const nftContract = getNFTContract(nft.contractAddress);
    const tokenURI = await nftContract.read.tokenURI([nft.id.toString(10)]);
    userStackedNFTWithURI.push({contractAddress: nft.contractAddress, id: nft.id, stackedTimestamp: nft.stackedTimestamp, tokenURI: tokenURI});
  }
  return userStackedNFTWithURI.map(_mapUserStackedNFT);

}