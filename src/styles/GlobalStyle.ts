import { createGlobalStyle } from "styled-components";

import theme from "./theme";

const GlobalStyle = createGlobalStyle`
	@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  html, body {
    font-family: 'Pretendard';
    background-color: #fff;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    min-width: 100vw;
    min-height: 100vh;
    @supports (-webkit-touch-callout: none) {
      min-height: -webkit-fill-available;
    }
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button {
    font: inherit;
    border: none;
    background: none;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  html, body, #root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

:root {
    ${Object.entries(theme.colors)
      .map(
        ([key, value]) => `
      --${key}: ${value};
    `
      )
      .join("\n")}
  }

  body {
    color: var(--text1);
  }
`;

export default GlobalStyle;
