import * as React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../../components/common/AppContext";

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <AppProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything from "@testing-library/react"
export * from "@testing-library/react";

// override "@testing-library/react" render
export { customRender as render };
