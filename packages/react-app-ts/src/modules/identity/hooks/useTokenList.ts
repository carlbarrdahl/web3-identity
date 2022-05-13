import { tokens } from "@uniswap/default-token-list";
import { contractAddresses } from "config";
import { useNetwork } from "wagmi";

const localChain = 31337;

export function useTokenList() {
  const { activeChain } = useNetwork();
  if (activeChain?.id === localChain) {
    return [
      {
        chainId: localChain,
        address: contractAddresses[localChain].erc20,
        name: "TEST",
        symbol: "TEST",
        decimals: 18,
        logoURI: "",
      },
    ];
  }

  return tokens.filter((token) => token.chainId === activeChain?.id);
}
