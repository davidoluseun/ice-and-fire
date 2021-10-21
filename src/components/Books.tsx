import * as React from "react";
import { Box } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "./Header";
import BookLists from "./BookLists";
import Loading from "./Loading";
import Error from "./Error";
import { fetchBooks } from "../utils/fetchBooks";
import { parseHeaders } from "../utils/parseHeaders";

type BooksState = {
  books: BookTypes[];
  searchQuery: string;
  nextLoading: boolean;
  initLoading: boolean;
  initUrl: string;
  nextUrl: string | undefined;
  initError: boolean;
  nextError: boolean;
};

class Books extends React.Component {
  state: BooksState = {
    books: [],
    searchQuery: "",
    nextLoading: false,
    initLoading: false,
    nextUrl: "",
    initError: false,
    nextError: false,
    initUrl: "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6",
  };

  componentDidMount() {
    this.setState({ initLoading: true });
    this.fetchInitBooks(this.state.initUrl);
  }

  componentWillUnmount() {
    this.setState({ nextLoading: false, initLoading: false });
  }

  fetchInitBooks = async (url: string) => {
    try {
      const response = await fetchBooks(url);
      const headerLinks = parseHeaders(response);
      const data = await response.json();

      this.setState({
        nextUrl: headerLinks.next,
        books: data,
        initLoading: false,
      });
    } catch (error) {
      this.setState({ initLoading: false, initError: true });
    }
  };

  fetchNextBooks = async (url: string) => {
    try {
      const response = await fetchBooks(url);
      const headerLinks = parseHeaders(response);
      const data = await response.json();

      this.setState({
        nextUrl: headerLinks.next,
        books: this.state.books.concat(data),
        nextLoading: false,
      });
    } catch (error) {
      this.setState({ nextLoading: false, nextError: true });
    }
  };

  handleFetchNextBooks = () => {
    if (this.state.nextUrl) {
      this.setState({ nextLoading: true });
      this.fetchNextBooks(this.state.nextUrl);
    }
  };

  handleInitTryAgain = () => {
    this.setState({ initLoading: true, initError: false });
    this.fetchInitBooks(this.state.initUrl);
  };

  handleNextTryAgain = () => {
    if (this.state.nextUrl) {
      this.setState({ nextLoading: true, nextError: false });
      this.fetchNextBooks(this.state.nextUrl);
    }
  };

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query });
  };

  handleFilter = (filter: string) => {
    console.log(filter);
  };

  render() {
    const { books, searchQuery, nextUrl, initLoading } = this.state;
    const { initError, nextError } = this.state;

    return (
      <Box
        mt="14"
        mb="8"
        marginX="auto"
        maxW="1200px"
        px={{ base: "4", md: "6" }}
      >
        {initLoading && <Loading />}
        {initError ? (
          <Error
            diffText={"connect to the API endpoint"}
            onTryAgain={this.handleInitTryAgain}
          />
        ) : (
          <Box>
            {books.length > 0 && (
              <Header
                searchQuery={searchQuery}
                handleSearch={this.handleSearch}
                handleFilter={this.handleFilter}
              />
            )}

            <InfiniteScroll
              dataLength={books.length}
              next={this.handleFetchNextBooks}
              hasMore={nextUrl ? true : false}
              loader={!nextError && <Loading />}
            >
              <BookLists
                books={books}
                onTryAgain={this.handleNextTryAgain}
                nextError={nextError}
              />
            </InfiniteScroll>
          </Box>
        )}
      </Box>
    );
  }
}

export default Books;
