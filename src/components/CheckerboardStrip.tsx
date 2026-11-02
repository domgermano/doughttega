import styled from "styled-components";

const Strip = styled.section`
  width: 100%;
  height: 248px;
  background-image:
    linear-gradient(to right, black 50%, lightgrey 50%),
    linear-gradient(to right, lightgrey 50%, black 50%);
  background-size:
    calc(100% / 5) 80%,
    calc(100% / 5);
  background-position:
    0 0,
    0 80%;
  background-repeat: repeat-x;

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    background-size:
      calc(100% / 7) 80%,
      calc(100% / 7);
  }

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    background-size:
      calc(100% / 9) 80%,
      calc(100% / 9);
  }

  @media (min-width: ${(p) => p.theme.breakpoints.lg}) {
    background-size:
      calc(100% / 12) 80%,
      calc(100% / 12);
  }

  @media (min-width: ${(p) => p.theme.breakpoints.xl}) {
    background-size:
      calc(100% / 16) 80%,
      calc(100% / 16);
  }
`;

function CheckerboardStrip() {
  return <Strip aria-hidden="true" />;
}

export default CheckerboardStrip;
