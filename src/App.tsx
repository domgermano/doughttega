import styled from "styled-components";
import Header from "./components/Header";
import CheckerboardStrip from "./components/CheckerboardStrip";
import Footer from "./components/Footer";
import Instructions from "./components/Instructions";
import MarketGrid from "./components/MarketGrid";
import NettingFigure from "./components/NettingFigure";
import WordmarkHero from "./components/WordmarkHero";

const AboveFold = styled.div`
  min-height: 50vh; /* fallback */
  min-height: 50svh; /* modern — locks to smallest viewport */
`;

function App() {
  return (
    <>
      <AboveFold>
        <Header />
        <MarketGrid />
      </AboveFold>
      <main>
        <WordmarkHero />
        <NettingFigure />
        <Instructions />
        <CheckerboardStrip />
      </main>
      <Footer />
    </>
  );
}

export default App;
