import Header from './components/Header'
import CheckerboardStrip from './components/CheckerboardStrip'
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
        {/* section 7 */}
      </main>
    </>
  )
}

export default App
