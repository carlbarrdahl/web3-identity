import React from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useSendTransaction,
  useSigner,
} from "wagmi";
import { Select } from "chakra-react-select";
import BorderedBox from "components/BorderedBox";
import ErrorMessage from "components/ErrorMessage";
import { useAcceptedERC20s } from "../hooks/useIdentity";
import { useAddressTokenSymbols } from "../hooks/useAddressTokenSymbol";
import { selectStyles } from "../utils/selectStyles";

interface Props {
  to: string;
}

const TokenSelector = ({ control, name, id, ...props }) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({ name, control });

  return (
    <Select
      name={name}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      chakraStyles={{
        ...selectStyles,
        container: (provided) => ({
          ...provided,
          position: "absolute",
          left: 1,
          width: 90,
        }),
      }}
      {...props}
    />
  );
};

const ethToken = { label: "ETH", value: "" };
export default function SendTokens({ to }: Props) {
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: { amount: "", token: ethToken },
    resolver: zodResolver(
      z.object({ amount: z.number().gt(0, { message: "Amount must be > 0" }) })
    ),
  });
  const { data: signer } = useSigner();

  const accepted = useAcceptedERC20s(to);
  const account = useAccount({});

  const tokenByAddress = useAddressTokenSymbols(accepted.data as any);
  const { isLoading, error, sendTransaction } = useSendTransaction({
    onSuccess() {
      reset();
    },
  });

  const selectedToken = watch("token");

  const { data: balance } = useBalance({
    addressOrName: account.data?.address,
    token: selectedToken.value,
  });

  function handleMax() {
    setValue("amount", balance?.formatted || "0");
  }

  return (
    <form
      onSubmit={handleSubmit(async ({ amount }) => {
        try {
          const value = ethers.utils.parseEther(String(amount));
          if (selectedToken.value) {
            const contract = await new ethers.Contract(
              selectedToken.value,
              erc20ABI,
              signer as any
            );
            console.log(contract);
            contract.transfer(to, value);
          } else {
            sendTransaction({ request: { to, value } });
          }
          reset();
        } catch (error) {}
      })}
    >
      <BorderedBox>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <TokenSelector
              control={control}
              id="token"
              name="token"
              options={[
                ethToken,
                ...(accepted.data?.map((value) => ({
                  label: tokenByAddress[value] || value,
                  value,
                })) || []),
              ]}
              placeholder="ETH"
              size="sm"
            />
          </InputLeftElement>
          <Input
            paddingLeft={"108px"}
            placeholder="0.00"
            border="none"
            type="number"
            min="0"
            step="0.0000000001"
            {...register("amount", { valueAsNumber: true })}
          />
          <InputRightElement>
            <Button size="sm" onClick={handleMax}>
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text ml={2} color="gray.500" fontSize={"xs"}>
          Balance: {balance?.formatted}
        </Text>
      </BorderedBox>
      <ErrorMessage error={error} />

      <Button
        disabled={isLoading || !isValid}
        isLoading={isLoading}
        w="100%"
        mt={2}
        type="submit"
      >
        Send {selectedToken.label}
      </Button>
    </form>
  );
}
