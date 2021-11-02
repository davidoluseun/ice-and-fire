import Books from "./components/books/Books";
import { ChakraProvider as Chakra } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Book from "./components/book/Book";
import Header from "./components/Header/Header";
import theme from "./theme-config/theme";

function App() {
  return (
    <Router>
      <Chakra resetCSS={true} theme={theme}>
        <Header />
        <Switch>
          <Route path="/:isbn" component={Book} />
          <Route exact path="/" component={Books} />
        </Switch>
      </Chakra>
    </Router>
  );
}

export default App;
