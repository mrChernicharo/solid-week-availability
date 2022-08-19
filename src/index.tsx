/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import { ThemeProvider } from "solid-styled-components";
import { THEME } from "./lib/constants";
import GlobalStyles from "./GlobalStyles";

render(
  () => (
    <>
      <GlobalStyles />
      <ThemeProvider theme={THEME}>
        <App />
      </ThemeProvider>
    </>
  ),
  document.getElementById("root") as HTMLElement
);
