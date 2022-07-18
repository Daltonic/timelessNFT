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
import UpdateNFT from './components/UpdateNFT'
import { isUserLoggedIn } from './CometChat'
import { loadWeb3 } from './TimelessNFT'
import { useEffect } from 'react'
import { useGlobalState } from './store'

const App = () => {
  const [currentUser] = useGlobalState('currentUser')
  const [connectedAccount] = useGlobalState('connectedAccount')

  useEffect(() => {
    loadWeb3()
    isUserLoggedIn()
  }, [])

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
      {currentUser?.uid.toLowerCase() == connectedAccount.toLowerCase() ? (
        <>
          <ChatList />
        </>
      ) : null}
      <Footer />
      <Alert />
      <Loading />
    </div>
  )
}

export default App
