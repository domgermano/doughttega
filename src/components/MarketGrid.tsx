import { useState } from "react";
import styled from "styled-components";
import { markets } from "../data/markets";
import { getMarketStatus } from "../utils/marketStatus";
import type { MarketWithStatus } from "../utils/marketStatus";
import BoundedBox from "./layout/BoundedBox";
import Grid from "./layout/Grid";

// --- MarketCard ---

const CardOuter = styled.article<{ $mobileHidden: boolean }>`
  border: 1px solid black;

  @media (max-width: calc(${(p) => p.theme.breakpoints.md} - 1px)) {
    display: ${(p) => (p.$mobileHidden ? "none" : "block")};
  }
`;

const NextBadge = styled.span`
  display: inline-block;
`;

function MarketCard({
  market,
  mobileHidden,
}: {
  market: MarketWithStatus;
  mobileHidden: boolean;
}) {
  return (
    <CardOuter $mobileHidden={mobileHidden}>
      {market.isNext && <NextBadge>NEXT</NextBadge>}
      <p>{market.name}</p>
      <p>{market.dates}</p>
    </CardOuter>
  );
}

// --- SeeMoreButton ---

const SeeMoreButton = styled.button`
  margin-top: ${(p) => p.theme.space[5]};

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    display: none;
  }
`;

// --- MarketGrid ---

const MarketSection = styled.section`
  margin-top: ${(p) => p.theme.space[7]};
`;

function MarketGrid() {
  const [expanded, setExpanded] = useState(false);
  const { markets: statusMarkets, empty } = getMarketStatus(
    markets,
    new Date(),
  );

  if (empty) {
    return (
      <MarketSection>
        <BoundedBox>
          <p>See you soon!</p>
        </BoundedBox>
      </MarketSection>
    );
  }

  const showToggle = statusMarkets.length > 1;

  return (
    <MarketSection>
      <BoundedBox>
        <Grid cols={3} gap={6}>
          {statusMarkets.map((market, i) => (
            <MarketCard
              key={market.name}
              market={market}
              mobileHidden={i > 0 && !expanded}
            />
          ))}
        </Grid>
        {showToggle && (
          <SeeMoreButton
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "See less" : "See more"}
          </SeeMoreButton>
        )}
      </BoundedBox>
    </MarketSection>
  );
}

export default MarketGrid;
