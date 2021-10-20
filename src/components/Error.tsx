import { Flex, Text, Heading, Button } from "@chakra-ui/react";

type InitialErrorProps = {
  onTryAgain: () => void;
  diffText: string;
};

const InitialError = ({ onTryAgain, diffText }: InitialErrorProps) => {
  return (
    <Flex
      p="4"
      mt="5"
      bg="#fff"
      as="section"
      borderRadius="md"
      direction="column"
      align="center"
      justify="center"
      boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
    >
      <Heading as="h1" fontSize="30px">
        Can't connect
      </Heading>
      <Text maxW="470px" mb="4" mt={{ base: "1", sm: "2" }} textAlign="center">
        Something went wrong trying to {diffText}. Please check your internet
        connection and try again.
      </Text>
      <Button
        bg="primary"
        color="#fff"
        _hover={{ bg: "primary" }}
        _active={{ bg: "primary" }}
        onClick={onTryAgain}
      >
        Try Again
      </Button>
    </Flex>
  );
};

export default InitialError;
