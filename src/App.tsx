import Header from './components/Header'
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
        {/* section 6 */}
      </main>
    </>
  )
}

export default App
