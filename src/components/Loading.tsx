import { Flex, Image } from "@chakra-ui/react";
import Spinner from "../images/spinner.gif";

const Loading = () => {
  return (
    <Flex align="center" justify="center" mt="3">
      <Image alt="loading" src={Spinner} />
    </Flex>
  );
};

export default Loading;
