import { useGlobalState, setGlobalState } from '../store'
import { useState } from 'react'

const MintNFT = () => {
  const [mintModal] = useGlobalState('mintModal')
  const [loading, setLoading] = useState(false)

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black 
      bg-opacity-50 transform scale-0 transition-transform
      duration-300 ${mintModal}`}
    >
      <div
        className="flex flex-row justify-center
        items-center bg-[#151c25] shadow-xl 
        shadow-[#e32970] rounded-xl 
        min-w-min px-10"
      >
        <div className="lds-dual-ring scale-50"></div>
        <p className="text-lg text-white">Minting...</p>
      </div>
    </div>
  )
}

export default MintNFT
