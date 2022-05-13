import {
  Box,
  Button,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBalance } from "wagmi";
import { CreatableSelect } from "chakra-react-select";
import { useTokenList } from "modules/identity/hooks/useTokenList";
import {
  useAcceptERC20,
  useAcceptedERC20s,
} from "modules/identity/hooks/useIdentity";
import { useAddressTokenSymbols } from "../hooks/useAddressTokenSymbol";

const BUTTON_WIDTH = 150;

export default function AcceptERC20({ address }) {
  const [selected, select] = useState("");
  const tokens = useTokenList();
  const accept = useAcceptERC20(address);
  const accepted = useAcceptedERC20s(address);

  const tokenByAddress = useAddressTokenSymbols(accepted.data as any);

  return (
    <Box>
      <Table variant={"unstyled"} size={"sm"} mb={2}>
        <Thead>
          <Th>Token</Th>
          <Th isNumeric w={100}>
            Balance
          </Th>
        </Thead>
        <Tbody>
          {["", ...(accepted.data || [])].map((token, i) => (
            <Tr fontSize="sm" key={token}>
              <Td>{tokenByAddress[token] || token || "ETH"}</Td>
              <Td isNumeric textAlign={"right"}>
                <ERC20Balance address={address} token={token} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <HStack>
        <Box flex={1}>
          <CreatableSelect
            placeholder="Select ERC20 to accept"
            onChange={(e) => select(e.value)}
            options={tokens
              .filter((token) => !(accepted.data || []).includes(token.address))
              .map((token) => ({ value: token.address, label: token.symbol }))}
          />
        </Box>

        <Button
          w={BUTTON_WIDTH}
          disabled={accept.isLoading || !selected}
          onClick={() => accept.write({ args: [selected] })}
          isLoading={accept.isLoading}
        >
          Add ERC20
        </Button>
      </HStack>
    </Box>
  );
}

function ERC20Balance({ address, token }) {
  const { data } = useBalance({ addressOrName: address, token });

  return <>{data?.formatted}</>;
}
