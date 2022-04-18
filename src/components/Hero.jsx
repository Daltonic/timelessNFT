import { setGlobalState } from '../store'
import { useGlobalState } from '../store'

const Hero = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <div
      className="flex flex-col md:flex-row w-4/5 justify-between 
      items-center mx-auto py-10"
    >
      <div className="md:w-3/6 w-full">
        <div>
          <h1 className="text-white text-5xl font-bold">
            Buy and sell <br /> digital Arts, <br />
            <span className="text-gradient">NFTs</span> collections
          </h1>
          <p className="text-gray-500 font-semibold text-sm mt-3">
            Mint and collect the hottest NFTs around.
          </p>
        </div>

        <div className="flex flex-row mt-5">
          {connectedAccount ? (
            <>
              <button
                onClick={() => setGlobalState('modal', 'scale-100')}
                className="shadow-xl shadow-black text-white
              bg-[#e32970] hover:bg-[#bd255f]
                rounded-full cursor-pointer p-2"
              >
                Create NFT
              </button>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="w-3/4 flex justify-between items-center mt-5">
          <div>
            <p className="text-white font-bold">1231k</p>
            <small className="text-gray-300">User</small>
          </div>
          <div>
            <p className="text-white font-bold">152k</p>
            <small className="text-gray-300">Artwork</small>
          </div>
          <div>
            <p className="text-white font-bold">200k</p>
            <small className="text-gray-300">Artist</small>
          </div>
        </div>
      </div>

      <div
        className="shadow-xl shadow-black md:w-2/5 w-full 
      mt-10 md:mt-0 rounded-md overflow-hidden bg-gray-800"
      >
        <img
          src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg"
          alt="NFT Art"
          className="h-60 w-full object-cover"
        />
        <div className="flex justify-start items-center p-3">
          <img
            src="https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/user/12.jpg"
            alt="Owner Image"
            className="h-10 w-10 object-contain rounded-full mr-3"
          />
          <div>
            <p className="text-white font-semibold">Moon light painting</p>
            <small className="text-pink-800 font-semibold">@deborah</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
