import styled from "styled-components";
import BoundedBox from "./layout/BoundedBox";
import Grid from "./layout/Grid";

const HeaderOuter = styled.header`
  margin-top: ${(p) => p.theme.space[7]};
`;

const HeaderText = styled.div`
  text-align: center;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    text-align: left;
  }
`;

const HeaderLogo = styled.div`
  order: -1;
  justify-items: center;
  flex-shrink: 0;

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    order: 0;
    justify-items: flex-end;
  }
`;

const LogoPlaceholder = styled.div`
  width: 80px;
  height: 100px;
  outline: 1px dashed currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

function Header() {
  return (
    <HeaderOuter>
      <BoundedBox>
        <Grid cols={3} gap={5}>
          <HeaderText>
            <h1>Doughttega: The Biscuit Deli</h1>
            <p>
              Artisanal biscuit dough. Ready to bake. We&apos;ve reinvented the
              deli drawer – think charcuterie, but with biscuit dough! Coming to
              a market near you
            </p>
          </HeaderText>
          <div />
          <HeaderLogo aria-label="Doughttega">
            <LogoPlaceholder>[logo]</LogoPlaceholder>
          </HeaderLogo>
        </Grid>
      </BoundedBox>
    </HeaderOuter>
  );
}

export default Header;
