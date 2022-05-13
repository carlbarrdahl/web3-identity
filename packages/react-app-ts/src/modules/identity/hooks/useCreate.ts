import { contractTypes } from "config";
import { useContractAddresses } from "modules/auth/hooks/useContractAddresses";
import { useContractEvent, useContractWrite } from "wagmi";

export default function useCreate(onCreated = (identity) => {}) {
  const addresses = useContractAddresses();

  const contractConfig = {
    addressOrName: addresses.registry,
    contractInterface: contractTypes.registry,
  };

  const create = useContractWrite(contractConfig, "create");

  // Listen to event and redirect to created identity
  useContractEvent(
    contractConfig,
    "IdentityCreated",
    ([identity]) => onCreated(identity),
    { once: true }
  );

  return create;
}
