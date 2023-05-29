import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig, createClient } from 'wagmi';
import { ChakraProvider } from "@chakra-ui/react";
import { goerli, localhost } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from 'react-query';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID_WALLET_CONNECT;

const {chains, provider, publicClient, webSocketPublicClient} = configureChains([localhost, goerli], [publicProvider()]);


const {connectors} = getDefaultWallets({
    appName: 'Stacking NFT', projectId: projectId, chains,
});

const wagmiConfig = createConfig({
    autoConnect: true, connectors, publicClient, webSocketPublicClient,
});

const queryClient = new QueryClient();
export default function App({Component, pageProps}) {
    return (<QueryClientProvider client={queryClient}>
            <ChakraProvider>
                <WagmiConfig config={wagmiConfig}>
                    <RainbowKitProvider chains={chains}>
                        <Component {...pageProps} />
                    </RainbowKitProvider>
                </WagmiConfig>
            </ChakraProvider>
        </QueryClientProvider>);
}
