import {
  Button,
  Flex,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { ChevronDownIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { SiEthereum } from "react-icons/si";

export default function NetworkSelector() {
  const {
    activeChain,
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  const supportedChain = chains.find((c) => c.id === activeChain?.id);

  if (isLoading) {
    return (
      <Flex
        width={"40px"}
        height="40px"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size={"md"} />
      </Flex>
    );
  }
  if (!activeChain) {
    return null;
  }
  return (
    <HStack>
      {error && (
        <Tooltip label={error?.message}>
          <Box pr={2}>
            <WarningTwoIcon color="red.500" />
          </Box>
        </Tooltip>
      )}
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          leftIcon={<SiEthereum />}
          rightIcon={<ChevronDownIcon />}
        >
          {(supportedChain && activeChain?.name) || "Unsupported chain"}
        </MenuButton>
        <MenuList>
          {chains.map((chain) => (
            <MenuItem
              key={chain.id}
              onClick={() => switchNetwork && switchNetwork(chain.id)}
            >
              {chain.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </HStack>
  );
}
