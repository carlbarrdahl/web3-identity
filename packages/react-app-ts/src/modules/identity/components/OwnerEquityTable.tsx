import { Table, Td, Th, Thead, Tr, Skeleton } from "@chakra-ui/react";
import { useOwnerEquity } from "modules/identity/hooks/useIdentity";

export default function OwnerEquityTable({ address }) {
  const { data = [], isLoading, error } = useOwnerEquity(address);
  return (
    <Table variant={"unstyled"} size="sm">
      <Thead>
        <Th>Owners</Th>
        <Th isNumeric w={100}>
          Equities
        </Th>
      </Thead>
      {(isLoading ? [[0, 0]] : data).map(([owner, equity], i) => {
        return (
          <Tr key={owner} verticalAlign="initial">
            <Td>
              <Skeleton isLoaded={!isLoading}>{owner}</Skeleton>
            </Td>
            <Td isNumeric textAlign={"right"}>
              <Skeleton isLoaded={!isLoading}>{equity}%</Skeleton>
            </Td>
          </Tr>
        );
      })}
    </Table>
  );
}
