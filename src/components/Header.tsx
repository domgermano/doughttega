import styled from "styled-components";
import logo from "../assets/ticket_logo.png";
import BoundedBox from "./layout/BoundedBox";
import Grid from "./layout/Grid";
import Text from "./layout/Text";

const HeaderOuter = styled.header`
  margin-top: ${(p) => p.theme.space[7]};
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[5]};
  text-align: center;
  color: ${(p) => p.theme.colors.black};

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
  height: 150px;
  width: auto;
`;

function Header() {
  return (
    <HeaderOuter>
      <BoundedBox>
        <Grid $cols={3} $gap={5}>
          <HeaderText>
            <Text skin="h4" as="h1" uppercase>
              Doughttega:
              <br />
              The Biscuit Deli
            </Text>
            <Text skin="bodyM" as="p">
              Artisanal biscuit dough. Ready to bake. We&apos;ve reinvented the
              deli drawer — think charcuterie, but with biscuit dough! Coming to
              a market near you.
            </Text>
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
