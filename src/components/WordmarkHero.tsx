import styled from "styled-components";
import wordmark from "../assets/wordmark_rough.svg";
import sticker from "../assets/sticker.svg";

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Wordmark = styled.img`
  display: block;
  width: 100%;
  transform: scale(1.01);
`;

const Sticker = styled.img`
  position: absolute;
  top: 10%;
  left: 35%;
  width: ${(p) => p.theme.space[9]};
`;

function WordmarkHero() {
  return (
    <HeroSection>
      <Wordmark src={wordmark} alt="Doughttega" />
      <Sticker src={sticker} alt="" aria-hidden="true" />
    </HeroSection>
  );
}

export default WordmarkHero;
