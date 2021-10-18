import { Flex } from "@chakra-ui/react";
import Search from "./Search";
import SearchFilter from "./SearchFilter";

type HeaderProps = {
  books: BookTypes[];
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleFilter: (filter: string) => void;
};

const Header = (props: HeaderProps) => {
  const { books, searchQuery, handleSearch, handleFilter } = props;
  
  return (
    <>
      {books.length > 0 && (
        <Flex
          p="5"
          bg="#fff"
          borderRadius="md"
          boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
        >
          <Search searchValue={searchQuery} onSearch={handleSearch} />
          <SearchFilter onFilter={handleFilter} />
        </Flex>
      )}
    </>
  );
};

export default Header;
