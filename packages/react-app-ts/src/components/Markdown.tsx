import React from "react";

import {
  Divider,
  Heading,
  Text,
  OrderedList,
  UnorderedList,
  ListItem,
  Image,
  Link,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: (p) => <Heading as="h1" fontSize="4xl" {...p} mb={6} />,
  h2: (p) => <Heading as="h2" fontSize="3xl" {...p} mb={4} />,
  h3: (p) => <Heading as="h3" fontSize="xl" {...p} mb={4} />,
  h4: (p) => <Heading as="h3" fontSize="lg" mb={4} {...p} />,
  h5: (p) => <Heading as="h3" fontSize="md" mb={4} {...p} />,
  h6: (p) => <Heading as="h3" fontSize="sm" mb={4} {...p} />,
  p: (p) => <Text fontSize="lg" {...p} mb={4} />,
  ul: (p) => <UnorderedList {...p} ml={8} mb={4} />,
  ol: (p) => <OrderedList {...p} ml={8} mb={4} />,
  li: (p) => <ListItem {...p} fontSize="lg" mb={2} />,
  img: (p) => <Image {...p} my={8} />,
  a: (p) => <Link color="blue.500" {...p} my={8} />,
  hr: (p) => <Divider {...p} my={8} />,
};

const remarkPlugins = [remarkGfm];
export default function Markdown({ children }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={remarkPlugins}>
      {children}
    </ReactMarkdown>
  );
}
