import Alert from './components/Alert'
import Artworks from './components/Artworks'
import CreateNFT from './components/CreateNFT'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Loading from './components/Loading'
import ShowNFT from './components/ShowNFT'
import Transactions from './components/Transactions'
import Chat from './components/Chat'
import ChatList from './components/ChatList'
import { loadWeb3 } from './TimelessNFT'
import { useEffect } from 'react'
import UpdateNFT from './components/UpdateNFT'

const App = () => {
  useEffect(() => loadWeb3(), [])

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <Artworks />
      <Transactions />
      <CreateNFT />
      <UpdateNFT />
      <ShowNFT />
      <Chat />
      <ChatList />
      <Footer />
      <Alert />
      <Loading />
    </div>
  )
}

export default App
