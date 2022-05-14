import {
  Button,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Avatar from "boring-avatars";

import { truncate } from "utils/truncate";

function ConnectedAccount({ address, onDisconnect }) {
  return (
    <Button
      variant="outline"
      onClick={onDisconnect}
      leftIcon={<Avatar size={20} name={address} />}
    >
      {truncate(address)}
    </Button>
  );
}

export default function ConnectWallet() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isConnecting } = useConnect({});

  if (isConnecting) {
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
  const { address } = account || {};
  return (
    <>
      {address ? (
        <ConnectedAccount address={address} onDisconnect={disconnect} />
      ) : (
        <Button onClick={() => onOpen()}>Connect wallet</Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {connectors.map((x) => (
              <Button
                w="100%"
                key={x.id}
                onClick={() => {
                  connect(x);
                  onClose();
                }}
                mb={2}
              >
                {x.name}
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
