'use client';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router'


import { Roboto } from 'next/font/google';

const roboto = Roboto({subsets: ['latin'], weight: ['100', '300', '400']});

import Head from 'next/head';
import styles from 'src/styles/Home.module.scss';
import CustomButton from "@/components/CustomButton/CustomButton";
import Layout from "@/pages/layout";

export const Connected = () => {
    const router = useRouter();
    return <div className={styles.connectedActions}>
        <CustomButton onClick={() => router.push('/wallet')}>My Wallet</CustomButton>
        <CustomButton onClick={() => router.push('/stacked')}>My Stacked NFTs</CustomButton>
    </div>
}

const NotConnected = () => {
    return <div style={{display: "flex", justifyContent: "center"}}>Please connect you wallet to proceed.</div>
}

const Home = () => {
    const {address, isConnected} = useAccount()
    const [RenderComponent, setRenderComponent] = useState(<></>);

    useEffect(() => {
        if (isConnected) {
            setRenderComponent(Connected);
        } else {
            setRenderComponent(NotConnected);
        }
    }, [isConnected]);
    return (<Layout>
        <div className={`${styles.container} ${roboto.className}`}>
            <Head>
                <title>RainbowKit App</title>
                <meta
                    content="Stacko"
                    name="We stack NFT"
                />
                <link href="/favicon.ico" rel="icon"/>
            </Head>

            <main className={styles.main}>
                <div className={styles.title}>
                    <h1>
                        Welcome to Stacko 🥸
                    </h1>
                    <h2>
                        Stack you NFT with confidences.
                    </h2>
                    {RenderComponent}
                </div>

            </main>
        </div>
    </Layout>);
};

export default Home;
