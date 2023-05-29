import React, { useEffect, useState } from "react";
import Layout from "@/pages/layout";
import styles from "../styles/stacked.module.scss"
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import NFTCard from "@/components/NFTCard/NFTCard";
import { STACKINGABI } from "@/asset/StackingABI";

const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_BACKEND_URL;

function Stacked() {
    const {address, isConnected} = useAccount();
    const {isLoading, isSuccess, error, data} = useQuery(['getUserStackedNFT', address], () => getUserStackedNFTs(address));
    const publicClient = usePublicClient();
    const mutationWithdraw = useMutation(({nftAddress, nftId}) => withdrawNFT(nftAddress, nftId));

    const {
        write: sendWithdraw, isError: sendWithdrawError, isSuccess: sendWithdrawSuccess,
    } = useContractWrite({
        abi: STACKINGABI, functionName: "withdrawNFT",
    });

    const withdrawNFT = async (nftAddress, nftId) => {
        const stackingContract = (await axios.get(`${BACKEND_URL}/nfts/stacking`)).data;
        await sendWithdraw({
            address: stackingContract, args: [nftAddress, nftId]
        });
    }
    const getUserStackedNFTs = async (wallet) => {
        if (wallet) {
            const res = (await axios.get(`${BACKEND_URL}/users/${wallet}/stacked`)).data;
            const promisesToFill = [];

            for (const nft of res) {
                const promiseURI = axios.get(nft.tokenURI).then((response) => ({...nft, ...response.data}));
                promisesToFill.push(promiseURI);
            }

            const results = await Promise.all(promisesToFill);
            return results;
        }
    }


    const renderUserStackedNFT = (data, index) => {
        return (<NFTCard key={index}
                         mutationWithdraw={() => mutationWithdraw.mutate({nftAddress: data.contractAddress, nftId: data.id})}
                         name={data.name} status={"stacked"} description={data.description} image={data.image} nftId={data.id} stackingTime={data.stackDate} nftContract={data.contractAddress} tokenURI={data.tokenURI}/>)
    }
    return (<Layout>
        <div className={styles.main}>
            <h1>Stacked NFT</h1>
            <div className={styles.nftContainer}>
                <h2>My Stack</h2>
                    {!isConnected && <div>Connect your wallet to see your stacked NFTs!</div>}
                    {isSuccess && data && data.length === 0 && <div>No NFT stacked (yet)</div>}
                    <div className={styles.nftCollection}>{!error && data && data.map((d, index) => renderUserStackedNFT(d, index))}</div>
                    {isLoading && "Loading NFTs..."}
            </div>
        </div>
    </Layout>)
}

export default Stacked;