import { useState } from "react";
import styled from "styled-components";
import { markets } from "../data/markets";
import { getMarketStatus } from "../utils/marketStatus";
import type { MarketWithStatus } from "../utils/marketStatus";
import BoundedBox from "./layout/BoundedBox";
import Button from "./layout/Button";
import Grid from "./layout/Grid";
import Text from "./layout/Text";

// --- MarketCard ---

const CardOuter = styled.article<{ $mobileHidden: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: calc(${(p) => p.theme.breakpoints.md} - 1px)) {
    display: ${(p) => (p.$mobileHidden ? "none" : "flex")};
  }
`;

const CardLocation = styled.div`
  background: ${(p) => p.theme.colors.darkGreen};
  padding: ${(p) => p.theme.space[3]};
  text-align: center;
  color: ${(p) => p.theme.colors.white};
`;

const CardDate = styled.div`
  flex: 1;
  border: 1px solid ${(p) => p.theme.colors.darkGreen};
  padding: ${(p) => p.theme.space[3]};
  text-align: center;
  color: ${(p) => p.theme.colors.black};
`;

const NextBadge = styled.span`
  position: absolute;
  top: -16px;
  left: -12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: ${(p) => p.theme.colors.mustard};
  border-radius: 100px;
  color: ${(p) => p.theme.colors.white};
  transform: rotate(-21deg);
  filter: drop-shadow(2px 2px 0.5px rgba(0, 0, 0, 0.25));
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
      {market.isNext && (
        <NextBadge aria-label="Next market">
          <Text skin="bodySStrong" uppercase>
            NEXT
          </Text>
        </NextBadge>
      )}
      <CardLocation>
        <Text skin="bodyM" as="p">
          {market.name}
        </Text>
      </CardLocation>
      <CardDate>
        <Text skin="bodyMStrong" as="p">
          {market.dates}
        </Text>
      </CardDate>
    </CardOuter>
  );
}

// --- SeeMoreButton ---

const SeeMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(p) => p.theme.space[5]};

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    display: none;
  }
`;

// --- MarketGrid ---

const MarketSection = styled.section`
  padding: ${(p) => p.theme.space[7]} 0 ${(p) => p.theme.space[10]} 0;
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
          <Text skin="bodyM" as="p">
            See you soon!
          </Text>
        </BoundedBox>
      </MarketSection>
    );
  }

  const showToggle = statusMarkets.length > 1;

  return (
    <MarketSection>
      <BoundedBox>
        <Grid $minColWidth="360px" $gap={6}>
          {statusMarkets.map((market, i) => (
            <MarketCard
              key={`${market.name}-${market.start}`}
              market={market}
              mobileHidden={i > 0 && !expanded}
            />
          ))}
        </Grid>
        {showToggle && (
          <SeeMoreWrapper>
            <Button
              $color="darkGreen"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? "See less" : "See more"}
            </Button>
          </SeeMoreWrapper>
        )}
      </BoundedBox>
    </MarketSection>
  );
}

export default MarketGrid;
