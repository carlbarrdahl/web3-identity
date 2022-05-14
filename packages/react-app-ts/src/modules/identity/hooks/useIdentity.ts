import { contractTypes } from "config";
import {
  erc20ABI,
  erc721ABI,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useQueryClient } from "react-query";

export function useAcceptERC20(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: contractTypes.identity,
    },
    "acceptERC20",
    "ERC20Accepted"
  );
}

export function useAcceptedERC20s(addressOrName) {
  return useContractRead(
    {
      addressOrName,
      contractInterface: contractTypes.identity,
    },
    "acceptedERC20s"
  );
}

export function useOwnerEquity(addressOrName) {
  const contractConfig = {
    addressOrName,
    contractInterface: contractTypes.identity,
  };

  const owners = useContractRead(contractConfig, "owners");
  const equities = useContractRead(contractConfig, "equities");
  const isLoading = owners.isLoading || equities.isLoading;
  const error = owners.error || equities.error;
  const data = owners.data?.map((owner, i) => [
    owner,
    (equities.data && equities.data[i].toNumber()) || 0,
  ]);
  return { ...owners, isLoading, error, data };
}

export function useGetApprovedNFT(addressOrName, tokenId) {
  return useContractRead(
    {
      addressOrName,
      contractInterface: erc721ABI,
    },
    "getApproved",
    { args: tokenId }
  );
}

export function useApproveNFT(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: erc721ABI,
    },
    "approve",
    "Approval"
  );
}

export function useTransferNFT(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: contractTypes.identity,
    },
    "transferNFT",
    "NFTTransfered"
  );
}

export function useWithdraw(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: contractTypes.identity,
    },
    "withdraw",
    "WithdrawETH"
  );
}

export function useDisintegrate(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: contractTypes.identity,
    },
    "disintegrate",
    "Disintegrate"
  );
}

export function useTransferERC20(addressOrName) {
  return useContractWriteRefresh(
    {
      addressOrName,
      contractInterface: erc20ABI,
    },
    "transfer",
    "Transfer"
  );
}

export function useContractWriteRefresh(contractConfig, method, eventName) {
  const cache = useQueryClient();

  const contract = useContractWrite(contractConfig, method);

  // Listen to event and invalidate cache
  useContractEvent(
    contractConfig,
    eventName,
    (e) => {
      console.log("Event received", eventName, e);
      cache.invalidateQueries();
    },
    {
      once: true,
    }
  );

  return contract;
}
