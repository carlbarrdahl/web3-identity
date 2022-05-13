import { ethers } from "ethers";
import { erc20ABI } from "wagmi";

export async function fetchTokenSymbols(addresses = [], signer) {
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
