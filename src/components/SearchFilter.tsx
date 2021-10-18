import * as React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  VisuallyHidden,
} from "@chakra-ui/react";

type SearchFilterTypes = {
  onFilter: (filter: string) => void;
};

const SearchFilter = ({ onFilter }: SearchFilterTypes) => {
  const [selectValue, setSelectValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter(e.currentTarget.value);
    setSelectValue(e.currentTarget.value);
  };

  return (
    <FormControl id="filter" maxW="200px">
      <VisuallyHidden>
        <FormLabel>Filter search</FormLabel>
      </VisuallyHidden>
      <Select
        value={selectValue}
        placeholder="Filter search"
        borderRadius="full"
        onChange={handleChange}
      >
        <option value="publisher">Publisher</option>
        <option value="name">Name</option>
        <option value="isbn">ISBN</option>
        <option value="authors">Authors</option>
        <option value="released">End Date</option>
        <option value="characters">Characters Name</option>
        <option value="culture">Characters Culture</option>
      </Select>
    </FormControl>
  );
};

export default SearchFilter;
