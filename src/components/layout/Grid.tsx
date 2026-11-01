import styled from "styled-components";
import type { DefaultTheme } from "styled-components";

type SpaceKey = keyof DefaultTheme["space"];

const Grid = styled.div<{ cols?: number; gap?: SpaceKey }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(p) => (p.gap != null ? p.theme.space[p.gap] : 0)};

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: repeat(${(p) => p.cols ?? 12}, 1fr);
  }
`;

export default Grid;
