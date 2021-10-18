import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "620px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
});

const styles = {
  global: () => ({
    body: {
      bg: "#f0f2f5",
      fontSize: "16px",
      color: "#000",
    },
  }),
};

const theme = extendTheme({
  breakpoints,
  styles,
  colors: {
    primary: "#007bff",
  },
});

export default theme;
