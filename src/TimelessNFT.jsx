import Web3 from 'web3'
import { setGlobalState } from './store'
import TimelessNFT from './abis/TimelessNFT.json'

const { ethereum } = window

const getContract = async () => {
  const web3 = window.web3
  const networkId = await web3.eth.net.getId()
  const networkData = TimelessNFT.networks[networkId]

  if (networkData) {
    const contract = new web3.eth.Contract(TimelessNFT.abi, networkData.address)
    return contract
  } else {
    window.alert('timelessNFT contract not deployed to detected network.')
  }
}

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

const loadBlockchainData = async () => {
  const web3 = window.web3
  const networkId = await web3.eth.net.getId()
  const networkData = TimelessNFT.networks[networkId]

  if (networkData) {
    const accounts = await web3.eth.getAccounts()
    setGlobalState('connectedAccount', accounts[0])
    // Load Contract
    const contract = new web3.eth.Contract(TimelessNFT.abi, networkData.address)
    setGlobalState('contract', contract)
  } else {
    window.alert('timelessNFT contract not deployed to detected network.')
  }
}

const loadWeb3 = async () => {
  if (!ethereum) return alert('Please install Metamask')

  window.web3 = new Web3(ethereum)
  await ethereum.enable()

  window.web3 = new Web3(window.web3.currentProvider)
}

const mintNFT = async (nft) => {
  window.web3 = new Web3(ethereum)
  nft.price = window.web3.utils.toWei(Number(nft.price).toString(), 'ether')
  const contract = await getContract()

  contract.methods
    .payToMint(nft.from, nft.image)
    .send({ from: nft.from, value: nft.price })
}

const getTotalMinted = async () => {
  const contract = await getContract()
  const count = await contract.methods.count().call()
  console.log(count)
  return count
}

const getMintedNFTS = async () => {
  const contract = await getContract()
  const nfts = await contract.methods.getMintedNFTs().call()
  console.log(nfts)
  return nfts
}

export {
  loadWeb3,
  loadBlockchainData,
  connectWallet,
  mintNFT,
  getTotalMinted,
  getMintedNFTS,
}
