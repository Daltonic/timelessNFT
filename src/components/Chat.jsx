import { useGlobalState, setGlobalState, truncate } from '../store'
import { sendMessage, CometChat } from '../CometChat'
import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const Chat = ({ nft, chats }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chats)

  const handleSubmit = async (e) => {
    e.preventDefault()
    sendMessage(nft.owner, message).then((msg) => {
      setMessages((prevState) => [...prevState, msg])
      setMessage('')
      scrollToEnd()
    })
  }

  const listenForMessage = (listenerID) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message) => {
          setMessages((prevState) => [...prevState, message])
          scrollToEnd()
        },
      })
    )
  }

  const onClose = () => {
    setGlobalState('chatOpened', false)
    setGlobalState('showModal', 'scale-100')
  }

  const scrollToEnd = () => {
    const element = document.getElementById('messages-container')
    element.scrollTop = element.scrollHeight
  }

  useEffect(() => {
    listenForMessage(nft.owner)
  }, [nft.owner])

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 scale-100`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-5/6 h-5/6 p-6">
        <div className="flex flex-col text-gray-400">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-center items-center">
              <div className="shrink-0 rounded-full overflow-hidden h-10 w-10 mr-3">
                <img
                  className="h-full w-full object-cover cursor-pointer"
                  src={nft.metadataURI}
                  alt={nft.owner}
                />
              </div>
              <p className="font-bold">{nft.title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <div
            id="messages-container"
            className="h-[calc(100vh_-_20rem)] overflow-y-auto sm:pr-4 my-3"
          >
            {messages.map((msg, i) =>
              msg?.receiverId?.toLowerCase() ==
              connectedAccount.toLowerCase() ? (
                <div
                  key={i}
                  className="flex flex-row justify-start items-center mt-5"
                >
                  <div className="flex flex-col justify-start items-start">
                    <h4 className="text-[#e32970]">
                      @{nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
                    </h4>
                    <p className="text-xs">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex flex-row justify-end items-center mt-5"
                >
                  <div className="flex flex-col justify-start items-end">
                    <h4 className="text-[#e32970]">@you</h4>
                    <p className="text-xs">{msg.text}</p>
                  </div>
                </div>
              )
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5"
          >
            <input
              className="block w-full text-sm resize-none
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0 h-20"
              type="text"
              name="message"
              placeholder="Write message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              required
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
