import * as React from "react";
import { Box, Link } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

type SearchResultProps = {
  queryItems: BookTypes[];
  onClearQuery: () => void;
};

const SearchResult = ({ queryItems, onClearQuery }: SearchResultProps) => {
  const history = useHistory();

  const handlePushToProduct = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    queryItem: BookTypes
  ) => {
    e.preventDefault();

    onClearQuery();
    history.push(`/${queryItem.isbn}`);
  };

  return (
    <Box
      bg="#fff"
      mt="1"
      w={{ base: "100%", sm: "400px" }}
      maxH="400px"
      overflowY="auto"
      top="65px"
      borderRadius="md"
      position="absolute"
      data-testid="result-box"
      display={queryItems.length === 0 ? "none" : "block"}
      border=".5px solid rgba(0, 0, 0, .15)"
      boxShadow="0 1px 2px rgba(0, 0, 0, .15)"
    >
      {queryItems.map((queryItem) => (
        <Link
          py="1"
          px="2"
          key={queryItem.isbn}
          display="block"
          data-testid="result-link"
          onClick={(e) => handlePushToProduct(e, queryItem)}
          _hover={{ textDecor: "none", bg: "primary", color: "#fff" }}
        >
          {queryItem.name}
        </Link>
      ))}
    </Box>
  );
};

export default SearchResult;
