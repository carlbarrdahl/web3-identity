import { Button, HStack, Select } from "@chakra-ui/react";
import {
  useTransferNFT,
  useApproveNFT,
  useGetApprovedNFT,
} from "modules/identity/hooks/useIdentity";
import { useNFTs } from "modules/identity/hooks/useNFTs";
import { useState } from "react";
import { useAccount } from "wagmi";

const BUTTON_WIDTH = 150;

function TransferNftButton({ account, address, collection, tokenId }) {
  const transfer = useTransferNFT(address);
  const approve = useApproveNFT(collection);
  const approved = useGetApprovedNFT(collection, tokenId);

  return approved.data === address ? (
    <Button
      w={BUTTON_WIDTH}
      onClick={() => transfer.write({ args: [collection, tokenId] })}
    >
      Transfer NFT
    </Button>
  ) : (
    <Button
      w={BUTTON_WIDTH}
      onClick={() => approve.write({ args: [address, tokenId] })}
    >
      Approve NFT
    </Button>
  );
}

export default function TransferNFT({ address }: { address: string }) {
  const [selected, select] = useState("");
  const { data = [] } = useNFTs(address);
  const account = useAccount();

  const [collection, tokenId] = selected.split(":");

  console.log("NFT", data);
  return (
    <HStack>
      <Select
        placeholder="Select NFT to transfer"
        value={selected}
        onChange={(e) => select(e.target.value)}
      >
        {
          // @ts-ignore
          data.map((nft) => (
            <option key={nft.title} value={`${nft.address}:${nft.id}`}>
              {nft.title}
            </option>
          ))
        }
      </Select>
      {selected ? (
        <TransferNftButton
          account={account.data?.address}
          address={address}
          collection={collection}
          tokenId={tokenId}
        />
      ) : (
        <Button disabled w={BUTTON_WIDTH}>
          Select NFT
        </Button>
      )}
    </HStack>
  );
}
