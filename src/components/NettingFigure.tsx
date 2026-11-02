import styled from "styled-components";
import biscuitLog from "../assets/biscuit_log.svg";

const NettingSection = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: lightgrey;
  z-index: -1;
`;

const PillContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.space[7]} ${(p) => p.theme.space[7]}
    ${(p) => p.theme.space[8]};

  & > div {
    flex: 1 0 0;
    height: 100%;
    border-radius: 1000px;
    outline: 1px dashed currentColor;

    &:nth-child(n + 3) {
      display: none;
    }

    @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
      &:nth-child(n + 3) {
        display: block;
      }
      &:nth-child(n + 4) {
        display: none;
      }
    }

    @media (min-width: ${(p) => p.theme.breakpoints.md}) {
      &:nth-child(n + 4) {
        display: block;
      }
    }
  }
`;

const NettingContent = styled.figure`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 0 ${(p) => p.theme.space[8]} ${(p) => p.theme.space[3]};
  gap: ${(p) => p.theme.space[5]};
`;

const BiscuitLog = styled.img`
  display: block;
  width: 100%;
  padding-block: ${(p) => p.theme.space[10]} ${(p) => p.theme.space[9]};

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    height: 300px;
  }

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    height: 400px;
  }

  @media (min-width: ${(p) => p.theme.breakpoints.lg}) {
    height: 500px;
  }
`;

function NettingFigure() {
  return (
    <NettingSection>
      <PillContainer aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
        <div />
      </PillContainer>
      <NettingContent>
        <BiscuitLog src={biscuitLog} alt="Ready-to-bake biscuit log" />
        <figcaption>Fig. 1.1: Ready-to-bake biscuit log</figcaption>
      </NettingContent>
    </NettingSection>
  );
}

export default NettingFigure;
