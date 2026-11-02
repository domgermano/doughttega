import styled from "styled-components";
import wordmark from "../assets/wordmark_clean.svg";
import BoundedBox from "./layout/BoundedBox";

const FooterOuter = styled.footer`
  padding-block: ${(p) => p.theme.space[6]};
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wordmark = styled.img`
  display: block;
  height: ${(p) => p.theme.space[8]};
  width: auto;
`;

function Footer() {
  return (
    <FooterOuter>
      <BoundedBox>
        <FooterInner>
          <Wordmark src={wordmark} alt="Doughttega" />
          {/* social links — coming later */}
        </FooterInner>
      </BoundedBox>
    </FooterOuter>
  );
}

export default Footer;
