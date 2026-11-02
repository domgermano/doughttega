import styled from "styled-components";
import { steps, stepsIntro } from "../data/steps";
import { serveItems, servesIntro, storageNote } from "../data/serves";
import BoundedBox from "./layout/BoundedBox";
import Grid from "./layout/Grid";

// --- Shared panel pieces ---

const Panel = styled.div`
  display: flex;
  flex-direction: column;
`;

const PanelTitle = styled.div`
  padding: ${(p) => p.theme.space[5]};
  border: 1px solid currentColor;
`;

const PanelSubtitle = styled.div`
  padding: ${(p) => p.theme.space[3]} ${(p) => p.theme.space[5]};
`;

const PanelBody = styled.div`
  flex: 1;
  padding: ${(p) => p.theme.space[5]};
  border: 1px solid currentColor;
`;

// --- How to eat ---

function HowToEat() {
  return (
    <Panel>
      <PanelTitle>
        <h2>How to eat:</h2>
      </PanelTitle>
      <PanelSubtitle>
        <p>{stepsIntro}</p>
      </PanelSubtitle>
      <PanelBody>
        <ol>
          {steps.map((step) => (
            <li key={step.number}>{step.text}</li>
          ))}
        </ol>
      </PanelBody>
    </Panel>
  );
}

// --- Bakes & serves ---

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[4]} ${(p) => p.theme.space[5]};
  border: 2px solid currentColor;
  border-radius: 100px;
  text-decoration: none;
`;

function BakesAndServes() {
  return (
    <Panel>
      <PanelTitle>
        <h2>Bakes &amp; Serves:</h2>
      </PanelTitle>
      <PanelSubtitle>
        <p>{servesIntro}</p>
      </PanelSubtitle>
      <PanelBody>
        <ul>
          {serveItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{storageNote}</p>
        <DownloadButton href="#" download>
          ↓ Gingerbread house template
        </DownloadButton>
      </PanelBody>
    </Panel>
  );
}

// --- Instructions ---

const InstructionsSection = styled.section`
  padding-block: ${(p) => p.theme.space[9]};
`;

function Instructions() {
  return (
    <InstructionsSection>
      <BoundedBox>
        <Grid cols={2} gap={7}>
          <HowToEat />
          <BakesAndServes />
        </Grid>
      </BoundedBox>
    </InstructionsSection>
  );
}

export default Instructions;
