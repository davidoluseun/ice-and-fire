import {
  FormControl,
  FormLabel,
  Input,
  VisuallyHidden,
} from "@chakra-ui/react";

type SearchProps = {
  onSearch: (query: string) => void;
  searchValue: string;
};

const Search = ({ searchValue, onSearch }: SearchProps) => {
  return (
    <FormControl id="search" maxW="300px" mr="4">
      <VisuallyHidden>
        <FormLabel>Search books...</FormLabel>
      </VisuallyHidden>
      <Input
        onChange={(e) => {
          onSearch(e.currentTarget.value);
        }}
        value={searchValue}
        borderRadius="full"
        type="search"
        placeholder="Search books..."
      />
    </FormControl>
  );
};

export default Search;
