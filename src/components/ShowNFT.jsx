import Chat from './Chat'
import Identicon from 'react-identicons'
import { FaTimes } from 'react-icons/fa'
import { buyNFT } from '../TimelessNFT'
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store'
import { useState } from 'react'
import { getMessages } from '../CometChat'

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal')
  const [chatOpened] = useGlobalState('chatOpened')
  const [currentUser] = useGlobalState('currentUser')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [nft] = useGlobalState('nft')
  const [messages, setMessages] = useState([])

  const onChangePrice = () => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-0')
    setGlobalState('updateModal', 'scale-100')
  }

  const onChatSeller = () => {
    if (currentUser?.uid.toLowerCase() != connectedAccount.toLowerCase())
      return alert('Please login to receive chats from buyers!')

    getMessages(nft.owner).then((msgs) => {
      setMessages(
        msgs.filter((msg) => {
          return (
            !!!msg?.deletedAt &&
            !!!msg?.action &&
            (msg?.conversationId ==
              `${msg?.rawMessage.receiver}_user_${msg?.rawMessage.sender}` ||
              msg?.conversationId ==
                `${msg?.rawMessage.sender}_user_${msg?.rawMessage.receiver}`)
          )
        })
      )
      setGlobalState('nft', nft)
      setGlobalState('showModal', 'scale-0')
      setGlobalState('chatOpened', true)
    })
  }

  const handleNFTPurchase = () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('loading', {
      show: true,
      msg: 'Initializing NFT transfer...',
    })

    try {
      buyNFT(nft).then((res) => {
        if (res) {
          setAlert('Transfer completed...', 'green')
          window.location.reload()
        }
      })
    } catch (error) {
      console.log('Error transfering NFT: ', error)
      setAlert('Purchase failed...', 'red')
    }
  }

  return (
    <div>
      {chatOpened ? (
        <Chat nft={nft} chats={messages} />
      ) : (
        <div
          className={`fixed top-0 left-0 w-screen h-screen flex items-center
          justify-center bg-black bg-opacity-50 transform
          transition-transform duration-300 ${showModal}`}
        >
          <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold text-gray-400">Buy NFT</p>
                <button
                  type="button"
                  onClick={() => setGlobalState('showModal', 'scale-0')}
                  className="border-0 bg-transparent focus:outline-none"
                >
                  <FaTimes className="text-gray-400" />
                </button>
              </div>

              <div className="flex flex-row justify-center items-center rounded-xl mt-5">
                <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
                  <img
                    className="h-full w-full object-cover cursor-pointer"
                    src={nft?.metadataURI}
                    alt={nft?.title}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start rounded-xl mt-5">
                <h4 className="text-white font-semibold">{nft?.title}</h4>
                <p className="text-gray-400 text-xs my-1">{nft?.description}</p>

                <div className="flex justify-between items-center mt-3 text-white">
                  <div className="flex justify-start items-center">
                    <Identicon
                      string={nft?.owner}
                      size={50}
                      className="h-10 w-10 object-contain rounded-full mr-3"
                    />
                    <div className="flex flex-col justify-center items-start">
                      <small className="text-white font-bold">@owner</small>
                      <small className="text-pink-800 font-semibold">
                        {nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
                      </small>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <small className="text-xs">Current Price</small>
                    <p className="text-sm font-semibold">{nft?.cost} ETH</p>
                  </div>
                </div>
              </div>
              {connectedAccount != nft?.owner ? (
                <div className="flex flex-row justify-between items-center">
                  <button
                    className="flex flex-row justify-center items-center
                w-full text-white text-md bg-[#e32970]
                hover:bg-[#bd255f] py-2 px-5 rounded-full
                drop-shadow-xl border border-transparent
                hover:bg-transparent hover:text-[#e32970]
                hover:border hover:border-[#bd255f]
                focus:outline-none focus:ring mt-5"
                    onClick={handleNFTPurchase}
                  >
                    Purchase Now
                  </button>
                  <button
                    className="flex flex-row justify-center items-center
                w-full text-white text-md bg-transparent 
                py-2 px-5 rounded-full drop-shadow-xl border
                border-transparent hover:bg-transparent
                hover:text-[#e32970] focus:outline-none
                focus:ring mt-5"
                    onClick={onChatSeller}
                  >
                    Chat with Seller
                  </button>
                </div>
              ) : (
                <button
                  className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5"
                  onClick={onChangePrice}
                >
                  Change Price
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowNFT
