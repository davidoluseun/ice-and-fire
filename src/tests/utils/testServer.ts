import { rest } from "msw";
import { setupServer } from "msw/node";
import { getBooks } from "../../fakeServices/fakeBookService";

const url = "https://www.anapioficeandfire.com/api/books";

const server = setupServer(
  rest.get(url, (req, res, ctx) => res(ctx.json(getBooks()))),

  rest.get("*", (req, res, ctx) => {
    console.error(`Please add a request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ Error: "Please add a request handler" })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server, rest };
