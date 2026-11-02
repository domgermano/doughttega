import Header from './components/Header'
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
        {/* sections 5–6 */}
      </main>
    </>
  )
}

export default App
