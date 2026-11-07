import styled, { css } from "styled-components";
import type { DefaultTheme } from "styled-components";
import { steps, stepsIntro } from "../data/steps";
import { serveItems, servesIntro, storageNote } from "../data/serves";
import BoundedBox from "./layout/BoundedBox";
import Button from "./layout/Button";
import Grid from "./layout/Grid";
import Text from "./layout/Text";
import DownloadIcon from "./icons/DownloadIcon";

type SpaceKey = keyof DefaultTheme["space"];

// --- Shared panel pieces ---

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.colors.mint};
`;

const PanelTitle = styled.div`
  padding: ${(p) => p.theme.space[5]};
  border: 1px solid ${(p) => p.theme.colors.mint};
`;

const PanelSubtitle = styled.div`
  padding: ${(p) => p.theme.space[3]} ${(p) => p.theme.space[5]};
  background: ${(p) => p.theme.colors.mint};
  color: ${(p) => p.theme.colors.darkGreen};
`;

const PanelBody = styled.div<{ $gap?: SpaceKey }>`
  flex: 1;
  padding: ${(p) => p.theme.space[5]};
  border: 1px solid ${(p) => p.theme.colors.mint};

  ol,
  ul {
    padding-inline-start: ${(p) => p.theme.space[6]};
  }

  ${(p) =>
    p.$gap &&
    css`
      display: flex;
      flex-direction: column;
      gap: ${p.theme.space[p.$gap]};
    `}
`;

// --- How to eat ---

function HowToEat() {
  return (
    <Panel>
      <PanelTitle>
        <Text skin="h4" as="h2" uppercase>
          How to prepare:
        </Text>
      </PanelTitle>
      <PanelSubtitle>
        <Text skin="bodyM" as="p">
          {stepsIntro}
        </Text>
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

const DownloadLink = styled(Button)`
  width: 100%;
  text-decoration: none;
`;

function BakesAndServes() {
  return (
    <Panel>
      <PanelTitle>
        <Text skin="h4" as="h2" uppercase>
          Serving suggestion:
        </Text>
      </PanelTitle>
      <PanelSubtitle>
        <Text skin="bodyM" as="p">
          {servesIntro}
        </Text>
      </PanelSubtitle>
      <PanelBody $gap={6}>
        <ul>
          {serveItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Text skin="bodyS" as="p">
          {storageNote}
        </Text>
        <DownloadLink
          as="a"
          $color="mustard"
          href={`${import.meta.env.BASE_URL}gingerbread-house-template.pdf`}
          download
        >
          <DownloadIcon /> Gingerbread house template
        </DownloadLink>
      </PanelBody>
    </Panel>
  );
}

// --- Instructions ---

const InstructionsSection = styled.section`
  background: ${(p) => p.theme.colors.darkGreen};
  padding-block: ${(p) => p.theme.space[9]};
`;

function Instructions() {
  return (
    <InstructionsSection>
      <BoundedBox>
        <Grid $cols={2} $gap={7}>
          <HowToEat />
          <BakesAndServes />
        </Grid>
      </BoundedBox>
    </InstructionsSection>
  );
}

export default Instructions;
