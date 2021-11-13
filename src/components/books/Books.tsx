import * as React from "react";
import { Box } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import BookLists from "./BookLists";
import NextLoading from "./NextLoading";
import InitialLoading from "./InitialLoading";
import Error from "./Error";
import Header from "../header/Header";
import { AppContext } from "../common/AppContext";
import { fetchBooks } from "../../utils/fetchBooks";
import { parseHeaders } from "../../utils/parseHeaders";
import { fetchCharacters } from "../../utils/fetchCharacters";

const Books = () => {
  const url = "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6";

  const { appState, appDispatch } = React.useContext(AppContext);
  const { books, nextUrl, characters } = appState;
  const { length: count } = books;

  const [initialLoading, setInitialLoading] = React.useState(false);
  const [initialError, setInitialError] = React.useState(false);
  const [, setNextLoading] = React.useState(false);
  const [nextError, setNextError] = React.useState(false);
  const [shouldTryAgain, setShouldTryAgain] = React.useState(false);

  React.useEffect(() => {
    const fetchInitBooks = async (url: string) => {
      setInitialLoading(true);
      setInitialError(false);

      try {
        const response = await fetchBooks(url);
        const data = await response.json();
        const headerLinks = parseHeaders(response);

        const characters = await fetchCharacters();

        const payload = { books: data, nextUrl: headerLinks.next, characters };
        appDispatch({ type: "FETCH_INIT", payload });
      } catch (error) {
        setInitialError(true);
      }

      setInitialLoading(false);
      setShouldTryAgain(false);
    };

    if (count <= 0) {
      fetchInitBooks(url);
    }
  }, [appDispatch, count, shouldTryAgain]);

  const fetchNextBooks = async (url: string) => {
    setNextLoading(true);
    setNextError(false);

    try {
      const response = await fetchBooks(url);
      const headerLinks = parseHeaders(response);
      const data = await response.json();

      const payload = {
        books: books.concat(data),
        nextUrl: headerLinks.next,
      };
      appDispatch({ type: "FETCH_NEXT_BOOKS", payload });
    } catch (error) {
      setNextError(true);
    }

    setNextLoading(false);
  };

  const handleFetchNextBooks = () => {
    if (nextUrl) {
      fetchNextBooks(nextUrl);
    }
  };

  const handleInitialTryAgain = () => {
    setShouldTryAgain(true);
  };

  const handleNextTryAgain = () => {
    fetchNextBooks(nextUrl);
  };

  return (
    <Box my="8" marginX="auto" maxW="1300px" px="4">
      {initialLoading ? (
        <InitialLoading />
      ) : (
        <>
          {initialError ? (
            <Error
              diffText={"connect to the API endpoint"}
              onTryAgain={handleInitialTryAgain}
            />
          ) : (
            <>
              <Header books={books} characters={characters} />
              <InfiniteScroll
                scrollThreshold={1}
                dataLength={books.length}
                next={handleFetchNextBooks}
                hasMore={nextUrl ? true : false}
                loader={!nextError && <NextLoading />}
              >
                <BookLists
                  books={books}
                  onTryAgain={handleNextTryAgain}
                  nextError={nextError}
                />
              </InfiniteScroll>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Books;
