import Web3 from 'web3'
import { setGlobalState, getGlobalState } from './store'
import TimelessNFT from './abis/TimelessNFT.json'

const { ethereum } = window

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    console.log(error)
    throw new Error('No ethereum object.')
  }
}

const setTransactions = (availableTransactions) => {
  const structuredTransactions = availableTransactions
    .map((tx) => ({
      id: tx.id,
      from: tx.from,
      to: tx.to,
      metadataURI: tx.metadataURI,
      cost: parseInt(tx.cost._hex) / 10 ** 18,
      timestamp: new Date(tx.timestamp.toNumber() * 1000).toLocaleString(),
    }))
    .reverse()
  setGlobalState('transactions', structuredTransactions)
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
      const contract = new web3.eth.Contract(TimelessNFT.abi, networkData.address)
      // const nfts = await contract.methods.getAllNFTs().call()

      // setGlobalState('nfts', structuredNfts(nfts))
      setGlobalState('contract', contract)
    } else {
      window.alert('TimelessNFT contract not deployed to detected network.')
    }
  } catch (error) {
    alert('Please connect your metamask wallet!')
  }
}

const mintNFT = async (nft) => {
  try {
    nft.price = window.web3.utils.toWei(Number(nft.price).toString(), 'ether')
    const contract = getGlobalState('contract')
    const account = getGlobalState('connectedAccount')

    await contract.methods
      .payToMint(nft.title, nft.description, nft.metadataURI)
      .send({ from: account, value: nft.price })

    return true;
  } catch (error) {
    alert(`Encountered: ${JSON.stringify(error)} while...`)
  }
}

const getTotalMinted = async () => {
  const contract = getGlobalState('contract')
  const count = await contract.methods.count().call()
  console.log(count)
  return count
}

const getMintedNFTS = async () => {
  const contract = getGlobalState('contract')
  const nfts = await contract.methods.getMintedNFTs().call()
  console.log(nfts)
  return nfts
}

export {
  loadWeb3,
  connectWallet,
  mintNFT,
  getTotalMinted,
  getMintedNFTS,
}
