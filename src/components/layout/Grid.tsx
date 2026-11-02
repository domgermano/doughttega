import styled, { css } from "styled-components";
import type { DefaultTheme } from "styled-components";

type SpaceKey = keyof DefaultTheme["space"];

const Grid = styled.div<{ $cols?: number; $gap?: SpaceKey; $minColWidth?: string }>`
  display: grid;
  gap: ${(p) => (p.$gap != null ? p.theme.space[p.$gap] : 0)};

  ${(p) =>
    p.$minColWidth
      ? css`
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(${p.$minColWidth}, 100%), 1fr)
          );
        `
      : css`
          grid-template-columns: 1fr;
          @media (min-width: ${p.theme.breakpoints.md}) {
            grid-template-columns: repeat(${p.$cols ?? 12}, 1fr);
          }
        `}
`;

export default Grid;
