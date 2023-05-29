// layout.js
import React from 'react';
import TopBar from "@/components/TopBar/TopBar";
import styles from "../styles/layout.module.scss"

const Layout = ({ children }) => {
    return (
        <>
            <TopBar />
            <main className={styles.content}>{children}</main>
        </>
    );
}

export default Layout;
