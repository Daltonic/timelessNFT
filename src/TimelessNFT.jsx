import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import TimelessNFT from './abis/TimelessNFT.json'

const { ethereum } = window

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    setAlert(JSON.stringify(error), 'red')
  }
}

const structuredNfts = (nfts) => {
  const web3 = window.web3
  return nfts
    .map((nft) => ({
      id: nft.id,
      to: nft.to,
      from: nft.from,
      cost: web3.utils.fromWei(nft.cost),
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    }))
    .reverse()
}

const loadWeb3 = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    window.web3 = new Web3(ethereum)
    await ethereum.enable()

    window.web3 = new Web3(window.web3.currentProvider)

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setGlobalState('connectedAccount', accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = TimelessNFT.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(
        TimelessNFT.abi,
        networkData.address
      )
      const nfts = await contract.methods.getAllNFTs().call()

      setGlobalState('nfts', structuredNfts(nfts))
      setGlobalState('contract', contract)
    } else {
      window.alert('TimelessNFT contract not deployed to detected network.')
    }
  } catch (error) {
    alert('Please connect your metamask wallet!')
  }
}

const mintNFT = async ({ title, description, metadataURI, price }) => {
  try {
    price = window.web3.utils.toWei(price.toString())
    const contract = getGlobalState('contract')
    const account = getGlobalState('connectedAccount')

    await contract.methods
      .payToMint(title, description, metadataURI)
      .send({ from: account, value: price })

    return true
  } catch (error) {
    setAlert(error.message, 'red')
  }
}

const getTotalMinted = async () => {
  const contract = getGlobalState('contract')
  const count = await contract.methods.count().call()
  console.log(count)
  return count
}

const getAllNFTs = async () => {
  const contract = getGlobalState('contract')
  const nfts = await contract.methods.getAllNFTs().call()
  console.log(nfts)
  // return nfts
}

export { loadWeb3, connectWallet, mintNFT, getTotalMinted, getAllNFTs }
