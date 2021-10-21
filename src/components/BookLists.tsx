import { Grid, Box, Flex } from "@chakra-ui/react";
import moment from "moment";
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
        {books.map((book) => {
          return (
            <Box
              key={book.isbn}
              p="4"
              bg="#fff"
              borderRadius="md"
              data-testid="book"
              boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
            >
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Publisher:
                </Box>
                <Box data-testid="publisher" flexBasis="62%">
                  {book.publisher}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Name:
                </Box>
                <Box data-testid="name" flexBasis="62%">
                  {book.name}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  ISBN:
                </Box>
                <Box data-testid="isbn" flexBasis="62%">
                  {book.isbn}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Authors:
                </Box>

                <Box flexBasis="62%">
                  {book.authors.map((author, index) =>
                    index !== book.authors.length - 1 ? (
                      <Box
                        data-testid="author"
                        pr="2"
                        key={book.isbn + author}
                        as="span"
                      >
                        <Box data-testid="author-name" as="span">
                          {author},
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        data-testid="author"
                        pr="2"
                        key={book.isbn + author}
                        as="span"
                      >
                        <Box data-testid="author-name" as="span">
                          {author}
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  End Date:
                </Box>
                <Box data-testid="released" flexBasis="62%">
                  {moment(book.released).format("DD/MM/YYYY")}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Country:
                </Box>
                <Box data-testid="country" flexBasis="62%">
                  {book.country}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Media Type:
                </Box>
                <Box data-testid="media" flexBasis="62%">
                  {book.mediaType}
                </Box>
              </Flex>
              <Flex p="2px">
                <Box fontWeight="semibold" flexBasis="38%">
                  Number of Pages:
                </Box>
                <Box data-testid="pages" flexBasis="62%">
                  {book.numberOfPages}
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Grid>
      {nextError && (
        <Error diffText="load more books" onTryAgain={onTryAgain} />
      )}
    </Box>
  );
};

export default BookLists;
