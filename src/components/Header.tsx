import * as React from "react";
import { Flex, Box } from "@chakra-ui/react";
import SearchField from "./SearchField";
import FilterField from "./FilterField";
import { AppContext } from "./AppContext";
import SearchResult from "./SearchResult";
import { searchHelper } from "../utils/searchHelper";

const Header = () => {
  const { appState } = React.useContext(AppContext);
  const { books, characters } = appState;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<BookKeys>("name");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilter = (filter: BookKeys) => {
    setFilter(filter);
  };

  let searchBooks: BookTypes[] = [];
  if (searchQuery)
    searchBooks = searchHelper({ filter, books, searchQuery, characters });

  if (books.length <= 0) return null;

  return (
    <Box mt="14" mb="8" marginX="auto" maxW="1300px" px="4">
      <Flex
        p="5"
        bg="#fff"
        borderRadius="md"
        position="relative"
        direction={{ base: "column", sm: "row" }}
        boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
      >
        <SearchField searchValue={searchQuery} onSearch={handleSearch} />
        <FilterField onFilter={handleFilter} />
        <SearchResult
          queryItems={searchBooks}
          onClearQuery={handleClearSearch}
        />
      </Flex>
    </Box>
  );
};

export default Header;
