import { Alert, AlertIcon } from "@chakra-ui/react";

export default function ErrorMessage({ error }) {
  return error ? (
    <Alert status="error" mb={2}>
      <AlertIcon />
      {error.data?.message || error.message}
    </Alert>
  ) : null;
}
