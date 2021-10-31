import {
  FormControl,
  FormLabel,
  Input,
  VisuallyHidden,
} from "@chakra-ui/react";

type SearchFieldProps = {
  onSearch: (query: string) => void;
  searchValue: string;
};

const SearchField = ({ searchValue, onSearch }: SearchFieldProps) => {
  return (
    <FormControl id="search" maxW="300px" mr="4">
      <VisuallyHidden>
        <FormLabel>Search books...</FormLabel>
      </VisuallyHidden>
      <Input
        value={searchValue}
        type="search"
        borderRadius="full"
        autoComplete="off"
        placeholder="Search books..."
        onChange={(e) => {
          onSearch(e.currentTarget.value);
        }}
      />
    </FormControl>
  );
};

export default SearchField;
