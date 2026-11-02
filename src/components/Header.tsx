import styled from "styled-components";
import logo from "../assets/ticket_logo.png";
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

const Logo = styled.img`
  display: block;
  width: 80px;
  height: auto;
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
          <HeaderLogo>
            <Logo src={logo} alt="Doughttega" />
          </HeaderLogo>
        </Grid>
      </BoundedBox>
    </HeaderOuter>
  );
}

export default Header;
