// import original module declarations
import "solid-styled-components";

// and extend them!
declare module "solid-styled-components" {
  export interface DefaultTheme {
    light: {
      primary: string;
      accent: string;
      text: string;
      text2: string;
      bg: string;
      bg2: string;
    };
    dark: {
      primary: string;
      accent: string;
      text: string;
      text2: string;
      bg: string;
      bg2: string;
    };
  }
}
