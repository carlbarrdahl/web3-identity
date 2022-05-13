import { Box } from "@chakra-ui/react";

export default function Card(props: any) {
  return (
    <Box
      borderRadius={6}
      borderWidth={1}
      borderColor="gray.200"
      boxShadow={"2xl"}
      //   width={"2xl"}
      p={6}
      {...props}
    />
  );
}
