import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useParams, Redirect } from "react-router-dom";
import { AppContext } from "./AppContext";
import BookLayout from "./BookLayout";

type useParamsTypes = {
  isbn: string;
};

const SearchBook = () => {
  const { appState } = React.useContext(AppContext);

  const { isbn } = useParams<useParamsTypes>();

  const book = appState.books.find((book) => book.isbn === isbn);

  if (!book) return <Redirect to="/" />;

  return (
    <Box my="8" marginX="auto" maxW="1200px" px={{ base: "4", md: "6" }}>
      <BookLayout hasMaxWidth={true} book={book} />
    </Box>
  );
};

export default SearchBook;
