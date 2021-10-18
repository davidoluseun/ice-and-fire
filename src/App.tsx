import React from "react";
import Books from "./components/Books";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme-config/theme";

function App() {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <Books />
    </ChakraProvider>
  );
}

export default App;
