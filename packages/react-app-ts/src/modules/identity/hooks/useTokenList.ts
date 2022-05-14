import { tokens } from "@uniswap/default-token-list";
import axios from "lib/axios";
import { contractAddresses } from "config";
import { useNetwork, useQuery } from "wagmi";

const localChain = 31337;

export function useTokenList() {
  const { activeChain } = useNetwork();

  // TODO: Mock this query on localChain using MSW
  const path = "https://static.optimism.io/optimism.tokenlist.json";
  return useQuery([path], async () =>
    // @ts-ignore
    axios
      .get(path)
      .then(({ tokens = [] }: any) =>
        tokens.filter((token) => token.chainId === activeChain?.id)
      )
  );
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
