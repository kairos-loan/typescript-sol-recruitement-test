import React, { useEffect, useState } from "react";
import Layout from "@/pages/layout";
import styles from "../styles/wallet.module.scss"
import { useQuery } from 'react-query';
import axios from 'axios';
import { stringToBytes } from "viem";
import { useAccount, useContractRead, usePublicClient, useWalletClient, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useMutation } from 'react-query';
import CustomButton from "@/components/CustomButton/CustomButton";
import { NFTABI } from "../asset/NFTAbi"
import { useToast } from "@chakra-ui/react";
import { STACKINGABI } from "@/asset/StackingABI";
import NFTCard from "@/components/NFTCard/NFTCard";


const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_BACKEND_URL;


function Wallet() {
    const toast = useToast()
    const publicClient = usePublicClient();
    const {address, isConnected} = useAccount();
    const {isLoading, error, isSuccess, data, refetch} = useQuery(['getUserNFT', address], () => getUserNFTs(address));

    const mutationApproval = useMutation(({nftAddress, nftId}) => approveNFT(nftAddress, nftId, address, sendApprove, publicClient));
    const mutationStacking = useMutation(({nftAddress, nftId}) => stackNFT(nftAddress, nftId, address, sendApprove, publicClient));
    const {
        write: sendApprove, isError: sendApproveError, isSuccess: sendApproveSuccess,
    } = useContractWrite({
        abi: NFTABI, functionName: "approve",
    });

    const {
        write: sendStacking, isError: sendStackingError, isSuccess: sendStackingSuccess,
    } = useContractWrite({
        abi: STACKINGABI, functionName: "stackNFT",
    });
    // Toaster for Approval
    useEffect(() => {
        if (sendApproveError) {
            toast({
                title: 'Error while processing to approve', status: 'error', duration: 3000, isClosable: true,
            });
        }
        if (sendApproveSuccess) {
            refetch();
            toast({
                title: 'Approve success !', status: 'success', duration: 3000, isClosable: true,
            });
        }
    }, [sendApproveError, sendApproveSuccess]);
    // Toaster for Stacking
    useEffect(() => {
        if (sendStackingError) {
            toast({
                title: 'Error while stacking your NFT', status: 'error', duration: 3000, isClosable: true,
            });
        }
        if (sendStackingSuccess) {
            toast({
                title: 'Congratulations ! Your NFT is #Stacked', status: 'success', duration: 3000, isClosable: true,
            });
        }
    }, [sendStackingError, sendStackingSuccess]);

    const approveNFT = async (nftAddress, nftId, address, sendApprove) => {
        const stackingContract = (await axios.get(`${BACKEND_URL}/nfts/stacking`)).data;
        await sendApprove({address: nftAddress, args: [stackingContract, nftId]});
    }

    const getUserNFTs = async (wallet) => {
        if (wallet) {
            const res = await axios.get(`${BACKEND_URL}/users/${wallet}/nfts`);
            const stackingContract = (await axios.get(`${BACKEND_URL}/nfts/stacking`)).data;
            // Get approval status for NFT
            const userListNFT = res.data;
            const promisesToFill = [];
            for (const nftContract of Object.keys(userListNFT)) {
                const ownedIds = userListNFT[nftContract];
                for (const nft of ownedIds) {
                    const promiseURI = axios.get(nft.tokenURI).then(({data}) => {
                        nft.tokenURIData = data;
                    });
                    promisesToFill.push(promiseURI);
                    if (nft.status === "stackable") {
                        const promiseApproved = publicClient.readContract({
                            address: nftContract, abi: NFTABI, functionName: 'getApproved', args: [nft.tokenId]
                        }).then(approvedAddress => {
                            nft.isApproved = approvedAddress.toLowerCase() === stackingContract.toLowerCase();
                        });
                        promisesToFill.push(promiseApproved);
                    }
                }
                await Promise.all(promisesToFill);
            }
            return userListNFT;
        }
    }

    const stackNFT = async (nftAddress, nftId) => {
        const stackingContract = (await axios.get(`${BACKEND_URL}/nfts/stacking`)).data;
        const merkleProof = (await axios.get(`${BACKEND_URL}/nfts/${nftAddress}/${nftId}`)).data;
        const signedRoot = (await axios.get(`${BACKEND_URL}/nfts/tree`)).data;
        await sendStacking({
            address: stackingContract, args: [nftAddress, nftId, merkleProof, `0x${signedRoot.root}`, signedRoot.v, signedRoot.r, signedRoot.s]
        });
    }

    function renderUserNFTs(userNft) {
        const renderNFTs = [];
        Object.keys(userNft).forEach((nftContract) => {
            const ownedIds = userNft[nftContract];
            ownedIds.forEach(async (nft, index) => {
                renderNFTs.push(<NFTCard key={`${nftContract}${index}`} name={nft.tokenURIData?.name} description={nft.tokenURIData?.description}
                                         image={nft.tokenURIData?.image} nftId={nft.tokenId} status={nft.status} nftContract={nftContract}
                                         tokenURI={nft.tokenURI} isApproved={nft.isApproved}
                                         mutationApproval={() => mutationApproval.mutate({nftAddress: nftContract, nftId: nft.tokenId})}
                                         mutationStacking={() => mutationStacking.mutate({nftAddress: nftContract, nftId: nft.tokenId})}/>);
            });
        });
        return renderNFTs;
    }

    return (<Layout>
        <div className={styles.main}>
            <h1>My Wallet</h1>
            <div className={styles.nftContainer}>
                <h2>My NFTs</h2>
                {isSuccess && data && data.length === 0 && <div>No NFT available for stacking</div>}
                <div className={styles.nftCollection}>{!error && data && renderUserNFTs(data)}</div>
                {!isConnected && <div>Connect your wallet to see your stacked NFTs!</div>}
                {isLoading && "Loading NFTs..."}
            </div>
        </div>
    </Layout>)
}

export default Wallet;