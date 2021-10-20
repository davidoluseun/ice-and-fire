import * as React from "react";
import { Box } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "./Header";
import BookLists from "./BookLists";
import Loading from "./Loading";
import { fetchBooks } from "../utils/fetchBooks";
import { parseHeaders } from "../utils/parseHeaders";

type BooksState = {
  books: BookTypes[];
  searchQuery: string;
  nextLoading: boolean;
  initLoading: boolean;
  nextUrl: string | undefined;
};

class Books extends React.Component {
  state: BooksState = {
    books: [],
    searchQuery: "",
    nextLoading: false,
    initLoading: false,
    nextUrl: "",
  };

  async componentDidMount() {
    this.setState({ initLoading: true });
    const url = "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6";

    const response = await fetchBooks(url);

    if (!response) return this.setState({ initLoading: false });

    const headerLinks = parseHeaders(response);
    const data = await response.json();
    this.setState({
      nextUrl: headerLinks.next,
      books: data,
      initLoading: false,
    });
  }

  componentWillUnmount() {
    this.setState({ nextLoading: false, initLoading: false });
  }

  fetchNextBooks = async (url: string) => {
    this.setState({ nextLoading: true });

    const response = await fetchBooks(url);

    if (!response) return this.setState({ nextLoading: false });

    const headerLinks = parseHeaders(response);
    const data = await response.json();

    this.setState({
      nextUrl: headerLinks.next,
      books: this.state.books.concat(data),
      nextLoading: false,
    });
  };

  handleFetchNextBooks = () => {
    if (this.state.nextUrl) {
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

    return (
      <Box
        mt="14"
        mb="8"
        marginX="auto"
        maxW="1200px"
        px={{ base: "4", md: "6" }}
      >
        {initLoading && <Loading />}
        <Box>
          <Header
            books={books}
            searchQuery={searchQuery}
            handleSearch={this.handleSearch}
            handleFilter={this.handleFilter}
          />

          <InfiniteScroll
            dataLength={books.length}
            next={this.handleFetchNextBooks}
            hasMore={nextUrl ? true : false}
            loader={<Loading />}
          >
            <BookLists books={books} />
          </InfiniteScroll>
        </Box>
      </Box>
    );
  }
}

export default Books;
