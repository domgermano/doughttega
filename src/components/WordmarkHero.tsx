import styled, { keyframes } from "styled-components";
import wordmark from "../assets/wordmark_rough.svg";
import sticker from "../assets/sticker.svg";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  margin-bottom: -${(p) => p.theme.space[6]};
`;

const Overflow = styled.div`
  overflow: hidden;
`;

const Wordmark = styled.img`
  display: block;
  width: 100%;
  transform: scale(1.01);
`;

const Sticker = styled.img`
  position: absolute;
  top: -${(p) => p.theme.space[6]};
  right: 8%;
  width: ${(p) => p.theme.space[9]};
  filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.25));
  animation: ${spin} 12s linear infinite;
`;

function WordmarkHero() {
  return (
    <HeroSection>
      <Overflow>
        <Wordmark src={wordmark} alt="Doughttega" />
      </Overflow>
      <Sticker src={sticker} alt="" aria-hidden="true" />
    </HeroSection>
  );
}

export default WordmarkHero;
