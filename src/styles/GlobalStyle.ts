import { createGlobalStyle } from "styled-components";
import paperTexture from "../assets/paper_texture.webp";

import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${(p) => p.theme.fonts.body};
    font-size: ${(p) => p.theme.type.bodyM.size};
    line-height: ${(p) => p.theme.type.bodyM.leading};
    color: ${(p) => p.theme.colors.black};
    background-color: ${(p) => p.theme.colors.mint};

    @supports (background-blend-mode: multiply) {
      background-image: url(${paperTexture});
      background-size: 1000px;
      background-position: center;
      background-blend-mode: multiply;
    }
  }
`;

export default GlobalStyle;
