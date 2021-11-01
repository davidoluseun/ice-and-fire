import React from "react";
import { render, screen, within } from "./utils/custom-render";
import userEvent from "@testing-library/user-event";
import { server, rest } from "./utils/testServer";
import { fetchBooks } from "../utils/fetchBooks";
import { fetchCharacters } from "../utils/fetchCharacters";
import { getBooks } from "./utils/makeBooks";
import { getCharacters } from "./utils/makeCharacters";
import { getNextCharactersLink } from "./utils/getNextCharactersLink";
import App from "../App";

const bookUrl = "https://www.anapioficeandfire.com/api/books";
const bookInitUrl = `${bookUrl}?page=1&pageSize=6`;
const bookNextUrl = `${bookUrl}?page=2&pageSize=6`;

const bookInitHeaderLink = `<${bookUrl}?page=2&pageSize=6>; rel="next",
 <${bookUrl}?page=1&pageSize=6>; rel="first",
 <${bookUrl}?page=2&pageSize=6>; rel="last"`;

const bookNextHeaderLink = `<${bookUrl}?page=1&pageSize=6>; rel="prev",
<${bookUrl}?page=1&pageSize=6>; rel="first",
<${bookUrl}?page=2&pageSize=6>; rel="last"`;

const characterUrl = "https://www.anapioficeandfire.com/api/characters";

describe("<App />", () => {
  beforeEach(() => {
    server.use(
      rest.get(bookUrl, (req, res, ctx) => {
        const page = Number(req.url.searchParams.get("page"));
        const pageSize = Number(req.url.searchParams.get("pageSize"));

        return res(
          ctx.json(getBooks(page, pageSize)),
          ctx.set("link", bookInitHeaderLink)
        );
      })
    );

    server.use(
      rest.get(characterUrl, (req, res, ctx) => {
        const page = Number(req.url.searchParams.get("page"));
        const pageSize = Number(req.url.searchParams.get("pageSize"));

        return res(
          ctx.json(getCharacters(page, pageSize)),
          ctx.set("link", getNextCharactersLink(page))
        );
      })
    );
  });

  describe("rendering the list of books available on Ice and Fire API", () => {
    it("should render the list of books having publisher, name, isbn, authors and end date", async () => {
      render(<App />);

      expect(screen.getByTestId("init-spinner")).toBeInTheDocument();

      const response = await fetchBooks(bookInitUrl);
      await response.json();

      await fetchCharacters();

      expect(screen.queryByTestId("init-spinner")).not.toBeInTheDocument();

      function getRenderedBooks() {
        return screen.getAllByTestId("book").map((book) => ({
          publisher: within(book).getByTestId("publisher").textContent,
          name: within(book).getByTestId("name").textContent,
          isbn: within(book).getByTestId("isbn").textContent,
          authors: within(book)
            .getAllByTestId("author")
            .map((authorName) => ({
              authorName: within(authorName).getByTestId("author-name")
                .textContent,
            })),
          released: within(book).getByTestId("released").textContent,
        }));
      }

      const books = getRenderedBooks();

      expect(books.length).toBe(6);

      books.forEach((book) => {
        expect(book).toHaveProperty("publisher");
        expect(book).toHaveProperty("isbn");
        expect(book).toHaveProperty("name");
        expect(book.authors.length).toBeGreaterThanOrEqual(1);
        expect(book).toHaveProperty("released");
      });
    });
  });

  describe("searching the list of books on the UI", () => {
    it("should search for books using name parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");

      userEvent.type(searchField, "Book 1");
      expect(searchField).toHaveValue("Book 1");

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe("Book 1");
    });
  });
});
