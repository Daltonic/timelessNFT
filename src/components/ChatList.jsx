// import { useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'

const ChatList = () => {
  const [modal] = useGlobalState('chatList')
  const [currentUser] = useGlobalState('currentUser')

  // useEffect(() => {
  //   console.log('Chat List', currentUser)
  // }, [currentUser])
  

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col text-gray-400">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Conversations</p>
            <button
              type="button"
              onClick={() => setGlobalState('chatList', 'scale-0')}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="h-[calc(100vh_-_20rem)] overflow-y-auto sm:pr-4 my-3">
            {/* Chat Start */}
            <div
              className="flex flex-row justify-between 
                  items-center bg-gray-800 hover:bg-gray-900 rounded-md 
                  px-4 py-3 my-1 cursor-pointer transform
                  transition-transform duration-300"
            >
              <div className="flex flex-col">
                <h4 className="text-sm text-[#e32970] font-semiBold">
                  @0xf1e...f20e
                </h4>
                <p className="text-xs">Lorem ipsum dalum...</p>
              </div>
              <p className="text-xs font-bold">12/07/22 12:05pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatList
