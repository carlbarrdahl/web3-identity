import { contractAddresses } from "config";
import { useNetwork } from "wagmi";

export function useContractAddresses() {
  const { activeChain } = useNetwork();

  const addresses = contractAddresses[activeChain?.id || "31337"];
  return addresses;
}
