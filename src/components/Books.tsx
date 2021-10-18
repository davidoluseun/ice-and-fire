import * as React from "react";
import { Box } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "./Header";
import BookLists from "./BookLists";
import Loading from "./Loading";

type BooksState = {
  books: BookTypes[];
  searchQuery: string;
  isLoading: boolean;
  nextUrl: string | undefined;
};

class Books extends React.Component {
  state: BooksState = {
    books: [],
    searchQuery: "",
    isLoading: false,
    nextUrl: "",
  };

  parseHeaders = (res: Response) => {
    return res.headers
      .get("link")
      ?.split(",")
      .reduce((acc: any, link) => {
        const resReg = /^\<(.+)\>; rel="(.+)"$/.exec(link.trim());

        if (!resReg) return acc;

        acc[resReg[2]] = resReg[1];
        return acc;
      }, {});
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    let url = "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6";

    fetch(url)
      .then((response) => {
        const headerLinks = this.parseHeaders(response);
        this.setState({ nextUrl: headerLinks.next });
        return response.json();
      })
      .then((data) => {
        this.setState({ books: data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      });
  }

  componentWillUnmount() {
    this.setState({ isLoading: false });
  }

  fetchNextBooks = (url: string) => {
    this.setState({ isLoading: true });

    fetch(url)
      .then((response) => {
        const headerLinks = this.parseHeaders(response);
        this.setState({ nextUrl: headerLinks.next });
        return response.json();
      })
      .then((data) => {
        this.setState({
          books: this.state.books.concat(data),
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      });
  };

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query });
  };

  handleFilter = (filter: string) => {
    console.log(filter);
  };

  handleFetchNextBooks = () => {
    if (this.state.nextUrl) {
      this.fetchNextBooks(this.state.nextUrl);
    }
  };

  render() {
    const { books, searchQuery, nextUrl } = this.state;

    return (
      <Box
        mt="14"
        mb="8"
        marginX="auto"
        maxW="1200px"
        px={{ base: "4", md: "6" }}
      >
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
