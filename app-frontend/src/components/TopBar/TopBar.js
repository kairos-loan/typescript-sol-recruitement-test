import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Link from 'next/link'
import styles from "./style.module.scss";
import { useAccount } from "wagmi";

const TopBar = () => {
    const {isConnected} = useAccount();

    return (
        <div className={styles.container}>
            <div className={styles.pageSelect}>
                <Link className={styles.appName} href={"/"}>Stacko🥸</Link>
                <Link disabled={!isConnected} className={styles.pageButton} href={"/wallet"}>Wallet</Link>
                <Link className={styles.pageButton} href={"/stacked"}>Stacked</Link>
            </div>
            <ConnectButton/>
        </div>
    );
}

export default TopBar;
