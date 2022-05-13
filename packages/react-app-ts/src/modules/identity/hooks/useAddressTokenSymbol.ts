import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { erc20ABI, useSigner } from "wagmi";

async function fetchTokenSymbols(addresses = [], signer) {
  return Promise.all(
    addresses.map(async (address) => ({
      address,
      symbol: await (
        await new ethers.Contract(address, erc20ABI, signer as any)
      ).symbol(),
    }))
  ).then((tokens) =>
    tokens
      .filter(Boolean)
      .reduce((acc, x) => ({ ...acc, [x.address]: x.symbol }), {})
  );
}
export function useAddressTokenSymbols(addresses = []) {
  const [tokenByAddress, setTokenByAddress] = useState({});
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer && addresses.length) {
      fetchTokenSymbols(addresses, signer).then(setTokenByAddress);
    }
  }, [addresses, signer]);

  return tokenByAddress;
}
