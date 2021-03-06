import Layout from "components/Layout";

import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

import useCreate from "modules/identity/hooks/useCreate";
import IdentityForm from "modules/identity/components/IdentityForm";
import { Heading, Text } from "@chakra-ui/react";
import BorderedBox from "components/BorderedBox";
import ErrorMessage from "components/ErrorMessage";

const IdentityCreate = ({}) => {
  const navigate = useNavigate();
  const account = useAccount();
  const create = useCreate((identity: string) => navigate(`/id/${identity}`));

  return (
    <Layout>
      <BorderedBox>
        <Heading as="h3" fontSize={"2xl"} mb={4}>
          Create new identity
        </Heading>
        <Text mb={6}>
          Add address and equity of all the owners of the identity contract.
        </Text>

        <ErrorMessage error={create.error} />

        <IdentityForm
          account={account.data?.address}
          isLoading={create.isLoading || create.data}
          onCreate={(args) => {
            create.write({ args });
          }}
        />
      </BorderedBox>
    </Layout>
  );
};

export default IdentityCreate;
