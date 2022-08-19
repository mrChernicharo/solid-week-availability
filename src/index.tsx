/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { DefaultTheme, ThemeProvider } from "solid-styled-components";
import { THEME } from "./lib/constants";

render(
	() => (
		<ThemeProvider theme={THEME}>
			<App />
		</ThemeProvider>
	),
	document.getElementById("root") as HTMLElement
);
