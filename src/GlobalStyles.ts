import { createGlobalStyles } from "solid-styled-components";

const GlobalStyles = () => {
  const Styles = createGlobalStyles`
    html,
    body {
      margin: 0;
      height: 200vh;
      background: #555;
      color: #fff;
      
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    * {
      box-sizing: border-box;
    }
  `;
  return Styles();
};

export default GlobalStyles;

/* 
TOUCH-ACTION: NONE ON THE BODY LOOKS LIKE A PLAUSIBLE SOLUTION...
BUT OUR MOUSEMOVE FUNCTIONS DIFFERENT IN THAT CASE
*/
