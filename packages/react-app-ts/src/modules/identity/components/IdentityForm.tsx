import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import BorderedBox from "components/BorderedBox";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { MinusIcon } from "@chakra-ui/icons";

function createSchema() {
  return zodResolver(
    z.object({
      owners: z.array(
        z.object({
          address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, {
            message: "Must be a valid address",
          }),
          equity: z.number().min(0, { message: "Must be a value > 0" }),
        })
      ),
    })
  );
}
export default function IdentityForm({ account, isLoading, onCreate }) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      owners: [{ address: account, equity: 100 }],
    },
    resolver: createSchema(),
  });
  const owners = useFieldArray({ control, name: "owners" });

  const totalEquity = watch().owners.reduce((sum, x) => sum + x.equity || 0, 0);

  const createDisabled = totalEquity !== 100;
  return (
    <Box
      as="form"
      onSubmit={handleSubmit((form) => {
        const owners = form.owners.map((o) => o.address);
        const equities = form.owners.map((o) => o.equity);
        onCreate([owners, equities]);
      })}
    >
      <Table size={"sm"}>
        <Thead>
          <Th>Owners</Th>
          <Th>Equities</Th>
          <Th></Th>
        </Thead>
        {owners.fields.map((field, i) => {
          const error = (errors.owners && errors.owners[i]) || {};
          return (
            <Tr key={field.id} verticalAlign="initial">
              <Td>
                <FormControl isInvalid={!!error.address}>
                  <Input {...register(`owners.${i}.address`, {})} />
                  <FormErrorMessage>{error.address?.message}</FormErrorMessage>
                </FormControl>
              </Td>
              <Td w={"100px"}>
                <FormControl isInvalid={!!error.equity}>
                  <Input
                    type="number"
                    {...register(`owners.${i}.equity`, {
                      valueAsNumber: true,
                    })}
                  />
                  <FormErrorMessage>{error.equity?.message}</FormErrorMessage>
                </FormControl>
              </Td>
              <Td isNumeric w={"60px"}>
                <Button size="sm" onClick={() => owners.remove(i)}>
                  <MinusIcon />
                </Button>
              </Td>
            </Tr>
          );
        })}
        <Tr>
          <Td colSpan={3}>
            <Button onClick={() => owners.append({ address: "", equity: 0 })}>
              Add owner
            </Button>
          </Td>
        </Tr>
      </Table>

      <HStack px={4} pt={2}>
        <FormControl isInvalid={totalEquity !== 100}>
          <FormErrorMessage>Total equity must be 100</FormErrorMessage>
        </FormControl>

        <Button
          disabled={createDisabled}
          type="submit"
          colorScheme={"blue"}
          isLoading={isLoading}
        >
          Create identity
        </Button>
      </HStack>
    </Box>
  );
}
