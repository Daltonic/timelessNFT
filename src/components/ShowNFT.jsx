import { useGlobalState, setGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal')
  const [nft] = useGlobalState('nft')

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform scale-0
      transition-transform duration-300 ${showModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Buy NFT</p>
            <button
              type="button"
              onClick={() => setGlobalState('showModal', '')}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={nft?.imgUrl}
                alt={nft?.title}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start rounded-xl mt-5">
            <h4 className="text-white font-semibold">{nft?.title}</h4>
            <p className="text-gray-400 text-xs my-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Architecto rem sapiente neque voluptate dignissimos magni, fugiat
              maiores sequi saepe similique adipisci quae dolorum error quas
              velit omnis suscipit assumenda officia.
            </p>

            <div className="flex justify-between items-center mt-3 text-white">
              <div className="flex justify-start items-center">
                <img
                  src={nft?.avatar}
                  alt={nft?.username}
                  className="h-10 w-10 object-contain rounded-full mr-3"
                />
                <small className="text-pink-800 font-semibold">
                  @{nft?.username}
                </small>
              </div>

              <div className="flex flex-col">
                <small className="text-xs">Current Price</small>
                <p className="text-sm font-semibold">2.34 ETH</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
          >
            Purchase Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShowNFT
