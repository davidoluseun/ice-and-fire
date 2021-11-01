import Books from "./components/Books";
import { ChakraProvider as Chakra } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SearchBook from "./components/SearchBook";
import Header from "./components/Header";
import theme from "./theme-config/theme";

function App() {
  return (
    <Router>
      <Chakra resetCSS={true} theme={theme}>
        <Header />
        <Switch>
          <Route path="/:isbn" component={SearchBook} />
          <Route exact path="/" component={Books} />
        </Switch>
      </Chakra>
    </Router>
  );
}

export default App;
