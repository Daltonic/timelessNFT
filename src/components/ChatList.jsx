import Moment from 'react-moment'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, truncate } from '../store'

const ChatList = ({ users }) => {
  return (
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
              <Conversation
                key={i}
                sender={user?.lastMessage.sender.uid}
                message={user?.lastMessage.text}
                timesamp={user?.lastMessage.sentAt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Conversation = ({ sender, message, timesamp }) => (
  <div
    className="flex flex-row justify-between 
      items-center bg-gray-800 hover:bg-gray-900 rounded-md 
      px-4 py-3 my-1 cursor-pointer transform
      transition-transform duration-300"
  >
    <div className="flex flex-col">
      <h4 className="text-sm text-[#e32970] font-semiBold">
        @{truncate(sender, 4, 4, 11)}
      </h4>
      <p className="text-xs">{message}</p>
    </div>
    <Moment
      className="text-xs font-bold"
      unix
      date={timesamp}
      format="YYYY/MM/D hh:mm A"
    />
  </div>
)

export default ChatList
