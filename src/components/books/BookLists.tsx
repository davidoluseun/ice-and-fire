import { Box, Grid } from "@chakra-ui/react";
import BookLayout from "../common/BookLayout";
import Error from "./Error";

type BookListsProps = {
  books: BookTypes[];
  onTryAgain: () => void;
  nextError: boolean;
};

const BookLists = ({ books, onTryAgain, nextError }: BookListsProps) => {
  return (
    <Box>
      <Grid
        mt="5"
        gridGap="6"
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {books?.map((book) => (
          <BookLayout key={book.isbn} book={book} />
        ))}
      </Grid>

      {nextError && (
        <Error diffText="load more books" onTryAgain={onTryAgain} />
      )}
    </Box>
  );
};

export default BookLists;