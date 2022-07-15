import { useGlobalState, setGlobalState, truncate } from '../store'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const Chat = () => {
  const [modal] = useGlobalState('chatInterface')
  const [nft] = useGlobalState('nft')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const onClose = () => {
    setGlobalState('chatInterface', 'scale-0')
    setGlobalState('showModal', 'scale-100')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-5/6 h-5/6 p-6">
        <div className="flex flex-col text-gray-400">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-center items-center">
              <div className="shrink-0 rounded-full overflow-hidden h-10 w-10 mr-3">
                <img
                  className="h-full w-full object-cover cursor-pointer"
                  src={nft?.metadataURI}
                  alt={nft?.owner}
                />
              </div>
              <p className="font-semibold text-[#e32970]">
                {nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          {true ? (
            <div className="flex flex-row justify-center items-center h-[calc(100vh_-_20rem)]">
              <button
                className="shadow-xl shadow-black text-white
              bg-[#e32970] hover:bg-[#bd255f]
                rounded-full cursor-pointer p-2"
              >
                Login to Chat
              </button>
            </div>
          ) : (
            <>
              <div
                id="messages-container"
                className="h-[calc(100vh_-_16rem)] overflow-y-auto sm:pr-4 my-3"
              >
                {/* Left */}
                <div className="flex flex-row justify-start items-center mt-5">
                  <div className="flex flex-col justify-start items-center">
                    <h4 className="text-[#e32970]">
                      @{nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
                    </h4>
                    <p className="text-xs">Chat View</p>
                  </div>
                </div>
                {/* Right */}
                <div className="flex flex-row justify-end items-center mt-5">
                  <div className="flex flex-col justify-start items-center">
                    <h4 className="text-[#e32970]">@you</h4>
                    <p className="text-xs">Chat View</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <textarea
                  className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                  focus:outline-none focus:ring-0 h-20"
                  type="text"
                  name="message"
                  placeholder="Write message..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  required
                ></textarea>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
