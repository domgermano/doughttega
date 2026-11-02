import Header from './components/Header'
import CheckerboardStrip from './components/CheckerboardStrip'
import Footer from './components/Footer'
import Instructions from './components/Instructions'
import MarketGrid from './components/MarketGrid'
import NettingFigure from './components/NettingFigure'
import WordmarkHero from './components/WordmarkHero'

function App() {
  return (
    <>
      <Header />
      <main>
        <MarketGrid />
        <WordmarkHero />
        <NettingFigure />
        <Instructions />
        <CheckerboardStrip />
      </main>
      <Footer />
    </>
  )
}

export default App
