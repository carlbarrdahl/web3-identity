import axios from "lib/axios";
import { alchemy, contractAddresses } from "config";
import { useQuery } from "wagmi";

const isDev = process.env.NODE_ENV != "production";

export function useNFTs(address: string) {
  const path = `https://eth-rinkeby.alchemyapi.io/v2/${alchemy.apiKey}/getNFTs?owner=${address}`;

  // @ts-ignore
  return useQuery([path], async () => {
    return axios.get(path).then((data: any) =>
      (data.ownedNfts || []).map((nft) => ({
        address: nft.contract.address,
        id: +nft.id.tokenId,
      }))
    );
  });
}
