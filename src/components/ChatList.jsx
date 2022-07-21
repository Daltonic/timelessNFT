import Chat from './Chat'
import Moment from 'react-moment'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, truncate, useGlobalState } from '../store'
import { getMessages } from '../CometChat'

const ChatList = ({ users }) => {
  const [messages, setMessages] = useState([])
  const [receiver, setReceiver] = useState('')
  const [recentChatOpened] = useGlobalState('recentChatOpened')
  const [connectedAccount] = useGlobalState('connectedAccount')

  const onEnterChat = (receiver) => {
    setReceiver(receiver)
    getMessages(receiver).then((msgs) => {
      setMessages(
        msgs.filter((msg) => {
          return (
            !!!msg?.deletedAt &&
            !!!msg?.action &&
            msg?.conversationId ==
              `${msg?.rawMessage.receiver}_user_${msg?.rawMessage.sender}`
          )
        })
      )
      setGlobalState('recentChatOpened', true)
    })
  }

  return (
    <div>
      {recentChatOpened ? (
        <Chat receiver={receiver} chats={messages} />
      ) : (
        <div
          className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 scale-100`}
        >
          <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
            <div className="flex flex-col text-gray-400">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold text-gray-400">Conversations</p>
                <button
                  type="button"
                  onClick={() => setGlobalState('recentOpened', false)}
                  className="border-0 bg-transparent focus:outline-none"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="h-[calc(100vh_-_20rem)] overflow-y-auto sm:pr-4 my-3">
                {users.map((user, i) => (
                  <button
                    key={i}
                    className="flex flex-row justify-between w-full
                    items-center bg-gray-800 hover:bg-gray-900 rounded-md 
                    px-4 py-3 my-1 cursor-pointer transform
                    transition-transform duration-300"
                    onClick={() => onEnterChat(user?.lastMessage.sender.uid)}
                  >
                    <div className="flex flex-col text-left">
                      <h4 className="text-sm text-[#e32970] font-semiBold">
                        @{truncate(user?.lastMessage.sender.uid, 4, 4, 11)}
                      </h4>
                      <p className="text-xs">
                        {user?.lastMessage.text}
                      </p>
                    </div>

                    <Moment
                      className="text-xs font-bold"
                      unix
                      date={user?.lastMessage.sentAt}
                      format="YYYY/MM/D hh:mm A"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatList
