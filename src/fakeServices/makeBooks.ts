const makeBooks = (n?: number) => {
  const num = n || 12;
  const books = [];

  for (let i = 0; i < num; i++) {
    books.push({
      url: `https://www.anapioficeandfire.com/api/books/${i}`,
      name: `Book name ${i}`,
      isbn: Math.floor(Math.random()),
      numberOfPages: i + 300,
      publisher: [
        "publisher1",
        "publisher2, publisher3, publisher4, publisher5",
      ][Math.floor(Math.random() * 2)],
      country: "country",
      characters: [],
      povCharacters: [],
    });
  }
};

export const books = makeBooks();
