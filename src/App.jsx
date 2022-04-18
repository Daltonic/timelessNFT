import { useEffect } from 'react'
import Alert from './components/Alert'
import Artworks from './components/Artworks'
import CreateNFT from './components/CreateNFT'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import MintNFT from './components/MintNFT'
import ShowNFT from './components/ShowNFT'
import Transactions from './components/Transactions'
import { loadWeb3 } from './TimelessNFT'

const App = () => {
  useEffect(() => {
    loadWeb3()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <Artworks />
      <Transactions />
      <Footer />
      <CreateNFT />
      <MintNFT />
      <Alert />
      <ShowNFT />
    </div>
  )
}

export default App
