import { useGlobalState, setGlobalState } from '../store'
import { useState } from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import { BsCheck2Circle } from 'react-icons/bs'

const Alert = () => {
  const [alertModal] = useGlobalState('alertModal')
  const [loading, setLoading] = useState(false)

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black 
      bg-opacity-50 transform scale-0 transition-transform
      duration-300 ${alertModal}`}
    >
      <div
        className="flex flex-col justify-center items-center
        bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl
        min-w-min py-3 px-10"
      >
        <FaRegTimesCircle className="text-red-600 text-4xl" />
        {/* <BsCheck2Circle className="text-green-600 text-4xl" /> */}
        <p className="text-white my-3">NFT minted successfully</p>
        <button
          onClick={() => setGlobalState('alertModal', '')}
          className="bg-[#e32970] hover:bg-[#bd255f]
        text-white md:text-xs p-2 rounded-full cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Alert
