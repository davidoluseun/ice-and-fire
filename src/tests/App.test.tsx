import React from "react";
import { render, screen, within } from "@testing-library/react";
import { server, rest } from "./testServer";
import { fetchBooks } from "../utils/fetchBooks";
import { getBooks } from "../fakeServices/fakeBookService";
import App from "../App";

const url = "https://www.anapioficeandfire.com/api/books";
const initUrl = `${url}?page=1&pageSize=6`;
const nextUrl = `${url}?page=2&pageSize=6`;

const initHeaderLink =
  '<https://www.anapioficeandfire.com/api/books?page=2&pageSize=6>; rel="next", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=6>; rel="first", <https://www.anapioficeandfire.com/api/books?page=2&pageSize=6>; rel="last"';

const nextHeaderLink =
  '<https://www.anapioficeandfire.com/api/books?page=1&pageSize=6>; rel="prev", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=6>; rel="first", <https://www.anapioficeandfire.com/api/books?page=2&pageSize=6>; rel="last"';

describe("<App />", () => {
  describe("rendering the list of books available on Ice and Fire API", () => {
    it("should render the first set of books(6)", async () => {
      server.use(
        rest.get(url, (req, res, ctx) => {
          return res(ctx.json(getBooks(1, 6)), ctx.set("link", initHeaderLink));
        })
      );

      render(<App />);

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

      const response = await fetchBooks(initUrl);
      await response.json();

      expect(getRenderedBooks().length).toBe(6);

      getRenderedBooks().forEach((book) => {
        expect(book).toHaveProperty("publisher");
        expect(book).toHaveProperty("isbn");
        expect(book).toHaveProperty("name");
        expect(book.authors.length).toBeGreaterThanOrEqual(1);
        expect(book).toHaveProperty("released");
      });
    });

    it("should render the next set of books(6)", async () => {
      server.use(
        rest.get(url, (req, res, ctx) => {
          return res(ctx.json(getBooks(2, 6)), ctx.set("link", nextHeaderLink));
        })
      );

      render(<App />);

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

      const response = await fetchBooks(nextUrl);
      await response.json();

      const bookSeven = getBooks(7, 1);
      const bookTwelve = getBooks(12, 1);

      expect(getRenderedBooks().length).toBe(6);
      expect(
        getRenderedBooks().find((book) => book.name === bookSeven[0].name)
      ).toBeTruthy();
      expect(
        getRenderedBooks().find((book) => book.name === bookTwelve[0].name)
      ).toBeTruthy();
    });
  });
});
