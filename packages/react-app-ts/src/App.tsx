import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, createClient, chain } from "wagmi";
import { QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";

import { providers } from "ethers";
import { InjectedConnector } from "@wagmi/core";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import IdentityCreate from "./pages/IdentityCreate";
import IdentityView from "./pages/IdentityView";
import NotFound from "./pages/NotFound";

const chains = [chain.rinkeby, chain.hardhat, chain.optimism];
const client = createClient({
  autoConnect: true,
  provider: ({ chainId }) => {
    if (chainId == 31337) {
      return new providers.JsonRpcProvider("http://localhost:8545", 31337);
    }
    return new providers.InfuraProvider(chainId);
  },
  connectors: ({}) => {
    return [
      new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
    ];
  },
});

function App() {
  return (
    <Provider client={client}>
      <QueryClientProvider client={client.queryClient}>
        <ChakraProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IdentityCreate />} />
              <Route path="/id/:id" element={<IdentityView />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
