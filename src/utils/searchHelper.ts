import moment from "moment";

type searchHelperTypes = {
  books: BookTypes[];
  filter: BookKeys;
  searchQuery: string;
  characters: CharacterTypes[];
};

export const searchHelper = (paramsObj: searchHelperTypes) => {
  const { filter, books, searchQuery, characters } = paramsObj;

  if (filter === "released") {
    return books.filter((book) =>
      moment(book["released"]).isSame(moment(searchQuery).format("DD-MM-YYYY"))
    );
  }

  if (filter === "authors") {
    return books.filter((book) =>
      book.authors.some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  if (filter === "characters" || filter === "culture") {
    let key: CharacterKeys = "culture";
    if (filter === "characters") key = "name";

    const character = characters.find(
      (character) => character[key].toLowerCase() === searchQuery.toLowerCase()
    );

    if (character)
      return books.filter((book) => {
        return character.books.some((b) => b === book.url);
      });
    else return [];
  }

  return books.filter((book) =>
    book[filter].toLowerCase().includes(searchQuery.toLowerCase())
  );
};
