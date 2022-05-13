import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import NetworkSelector from "modules/auth/components/NetworkSelector";
import ConnectWallet from "modules/auth/components/ConnectWallet";

interface Props {
  children: React.ReactNode;
  title?: string;
}
const maxWidth = "container.lg";
export default function Layout({ children, title = "Web3 Identity" }: Props) {
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const description = "Create your Web3 Identity";
  const url = "https://web3-identity.vercel.app";
  return (
    <>
      <Flex flexDir={"column"} minH={"100vh"}>
        <Flex as="header" borderBottom={"1px solid"} borderColor={borderColor}>
          <Flex as={Container} maxW={maxWidth} justify="space-between" py={4}>
            <HStack>
              <Link to={"/"}>
                <Heading>{title}</Heading>
              </Link>
            </HStack>
            <HStack>
              <NetworkSelector />
              <ConnectWallet />
            </HStack>
          </Flex>
        </Flex>
        <Box bg="white" flex={1}>
          <Container maxW={maxWidth} pt={14} pb={24}>
            {children}
          </Container>
        </Box>
      </Flex>
    </>
  );
}

function NavLink({ href, ...props }) {
  return (
    <Link to={href}>
      <Button variant={"ghost"} {...props} />
    </Link>
  );
}
