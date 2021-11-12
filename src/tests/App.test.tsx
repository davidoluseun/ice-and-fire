import React from "react";
import { render, screen, within } from "./utils/custom-render";
import userEvent from "@testing-library/user-event";
import moment from "moment";
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
      const books = await response.json();

      await fetchCharacters();

      expect(screen.queryByTestId("init-spinner")).not.toBeInTheDocument();

      const renderedBooks = screen.getAllByTestId("book").map((book) => ({
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

      expect(renderedBooks.length).toBe(books.length);

      renderedBooks.forEach((book, i) => {
        expect(book).toHaveProperty("publisher", books[i].publisher);
        expect(book).toHaveProperty("isbn", books[i].isbn);
        expect(book).toHaveProperty("name", books[i].name);
        expect(book.authors.length).toBe(books[i].authors.length);
        book.authors.forEach((author, index) =>
          expect(author.authorName).toBe(books[i].authors[index])
        );
        expect(book).toHaveProperty(
          "released",
          moment(books[i].released).format("YYYY-MM-DD")
        );
      });
    });
  });

  describe("searching the list of books on the UI", () => {
    it("should search for books using name parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");

      expect(resultBox).not.toBeVisible();

      userEvent.type(searchField, books[0].name);
      expect(searchField).toHaveValue(books[0].name);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(books[0].name);
    });

    it("should search for books using publisher parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "publisher");

      userEvent.type(searchField, books[0].publisher);
      expect(searchField).toHaveValue(books[0].publisher);

      expect(resultBox).toBeVisible();

      const matchBooks = books.filter(
        (book: BookTypes) => book.publisher === books[0].publisher
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book: BookTypes, i: number) => {
        expect(book["name"]).toBe(resultLinks[i]["name"]);
      });
    });

    it("should search for books using isbn parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "isbn");

      userEvent.type(searchField, books[0].isbn);
      expect(searchField).toHaveValue(books[0].isbn);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(books[0].name);
    });

    it("should search for books using end date parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "released");

      const date = moment(books[0].released).format("YYYY-MM-DD");

      userEvent.type(searchField, date);
      expect(searchField).toHaveValue(date);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(books[0].name);
    });

    it("should search for books using authors parameter", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "authors");

      userEvent.type(searchField, books[0].authors[0]);
      expect(searchField).toHaveValue(books[0].authors[0]);

      expect(resultBox).toBeVisible();

      const matchBooks = books.filter((book: BookTypes) =>
        book.authors.some((author) => author === books[0].authors[0])
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book: BookTypes, i: number) => {
        expect(book["name"]).toBe(resultLinks[i]["name"]);
      });
    });

    it("should search for books using characters name", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      const characters = await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "characters");

      userEvent.type(searchField, characters[0].name);
      expect(searchField).toHaveValue(characters[0].name);

      expect(resultBox).toBeVisible();

      const matchCharacters = characters.filter(
        (character: CharacterTypes) => character.name === characters[0].name
      );

      const matchBooks = books.filter((book: BookTypes) =>
        matchCharacters.some((matchCharacter: CharacterTypes) =>
          matchCharacter.books.some((bookUrl) => bookUrl === book.url)
        )
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book: BookTypes, i: number) => {
        expect(book["name"]).toBe(resultLinks[i]["name"]);
      });
    });

    it("should search for books using characters culture", async () => {
      render(<App />);

      const response = await fetchBooks(bookInitUrl);
      const books = await response.json();

      const characters = await fetchCharacters();

      const searchField = screen.getByLabelText("Search books...");
      const resultBox = screen.getByTestId("result-box");
      const filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();

      userEvent.selectOptions(filterField, "culture");

      userEvent.type(searchField, characters[0].culture);
      expect(searchField).toHaveValue(characters[0].culture);

      expect(resultBox).toBeVisible();

      const matchCharacters = characters.filter(
        (character: CharacterTypes) =>
          character.culture === characters[0].culture
      );

      const matchBooks = books.filter((book: BookTypes) =>
        matchCharacters.some((matchCharacter: CharacterTypes) =>
          matchCharacter.books.some((bookUrl) => bookUrl === book.url)
        )
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book: BookTypes, i: number) => {
        expect(book["name"]).toBe(resultLinks[i]["name"]);
      });
    });
  });
});
