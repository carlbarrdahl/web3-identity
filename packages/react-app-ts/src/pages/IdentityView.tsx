import { useParams } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Code,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";

import { useBalance } from "wagmi";

import {
  useDisintegrate,
  useWithdraw,
} from "modules/identity/hooks/useIdentity";
import SendTokens from "modules/identity/components/SendTokens";
import TransferNFT from "modules/identity/components/TransferNFT";
import AcceptERC20 from "modules/identity/components/AcceptERC20";
import OwnerEquityTable from "modules/identity/components/OwnerEquityTable";
import Layout from "components/Layout";
import BorderedBox from "components/BorderedBox";

function IdentityInfo({ address }) {
  return (
    <Box mb={4}>
      <HStack>
        <Heading as="h3" fontSize="2xl">
          Identity
        </Heading>
      </HStack>
      <Code>{address}</Code>
    </Box>
  );
}

function DisintegrateButton({ address }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const disintegrate = useDisintegrate(address);
  return (
    <>
      <Button w={"100%"} colorScheme={"red"} variant="ghost" onClick={onOpen}>
        Disintegrate
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>Disintegrate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Alert status="warning">
                <AlertDescription>
                  This will return all NFTs to their original owners and send
                  ERC20 tokens and ETH according to equity.
                </AlertDescription>
              </Alert>
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Text>Are you sure?</Text>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button colorScheme={"red"} onClick={() => disintegrate.write()}>
                Disintegrate
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function WithdrawButton({ address }) {
  const withdraw = useWithdraw(address);
  return (
    <Button w={"100%"} onClick={() => withdraw.write({ args: [] })}>
      Withdraw
    </Button>
  );
}

function ETHBalance({ address }) {
  const { data } = useBalance({ addressOrName: address });
  return <Box>{data?.formatted}</Box>;
}

function Identity({ id }) {
  return (
    <>
      <HStack justify={"flex-end"} mb={4}></HStack>
      <IdentityInfo address={id} />
      <SimpleGrid spacingX={8} templateColumns={["1fr", "1fr", "2fr 1fr"]}>
        <Box>
          <BorderedBox mb={4}>
            <Divider my={2} />
            <VStack spacing={2} align="stretch">
              <OwnerEquityTable address={id} />
              <AcceptERC20 address={id} />
              <TransferNFT address={id} />
            </VStack>
          </BorderedBox>
        </Box>
        <Box>
          <SendTokens to={id} />
          <Divider my={2} />
          <HStack>
            <DisintegrateButton address={id} />
            <WithdrawButton address={id} />
          </HStack>
        </Box>
      </SimpleGrid>
    </>
  );
}

const IdentityPage = ({}) => {
  const { id } = useParams();
  if (!id) {
    return <div>...</div>;
  }
  return (
    <Layout>
      <Identity id={id} />
    </Layout>
  );
};

export default IdentityPage;
