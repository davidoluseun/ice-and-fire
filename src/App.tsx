import Books from "./components/Books";
import { ChakraProvider as Chakra } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AppProvider } from "./components/AppContext";
import SearchBook from "./components/SearchBook";
import Header from "./components/Header";
import theme from "./theme-config/theme";

function App() {
  return (
    <AppProvider>
      <Router>
        <Chakra resetCSS={true} theme={theme}>
          <Header />
          <Switch>
            <Route path="/:isbn" component={SearchBook} />
            <Route exact path="/" component={Books} />
          </Switch>
        </Chakra>
      </Router>
    </AppProvider>
  );
}

export default App;
