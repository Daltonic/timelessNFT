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
  return nfts
    .map((nft) => ({
      id: Number(nft.id),
      owner: nft.owner,
      cost: window.web3.utils.fromWei(nft.cost),
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
      const transactions = await contract.methods.getAllTransactions().call()

      setGlobalState('nfts', structuredNfts(nfts))
      setGlobalState('transactions', structuredNfts(transactions))
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
    price = window.web3.utils.toWei(price.toString(), 'ether')
    const contract = getGlobalState('contract')
    const account = getGlobalState('connectedAccount')
    const mintPrice = window.web3.utils.toWei('0.01', 'ether')

    await contract.methods
      .payToMint(title, description, metadataURI, price)
      .send({ from: account, value: mintPrice })

    return true
  } catch (error) {
    setAlert(error.message, 'red')
  }
}

const buyNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = getGlobalState('contract')
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.payToBuy(Number(id)).send({ from: buyer, value: cost })

    return true
  } catch (error) {
    setAlert(error.message, 'red')
  }
}

export { loadWeb3, connectWallet, mintNFT, buyNFT }
