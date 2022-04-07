/* eslint-disable no-undef */
const TimelessNFT = artifacts.require("TimelessNFT");

module.exports = async (callback) => {
  const [deployer, artist, buyer1, buyer2] = await web3.eth.getAccounts()

  const mintPrice = web3.utils.toWei('1', 'ether')
  const salePrice = web3.utils.toWei('10', 'ether')

  const timelessNFT = await TimelessNFT.deployed()

  const metadataURI = 'CID/test.png'

  let deployerBal = await web3.eth.getBalance(deployer)
  let artistBal = await web3.eth.getBalance(artist)
  let buyer1Bal = await web3.eth.getBalance(buyer1)
  let buyer2Bal = await web3.eth.getBalance(buyer2)

  console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer1   | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer2   | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  console.log(`Minting NFT for buyer1...\n`)

  await timelessNFT.payToMint(buyer1, metadataURI, { value: mintPrice })

  console.log(`NFT has been minted!\n`)

  console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer1   | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer2   | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  console.log(`Performing transfer sale to buyer2...\n`)

  await timelessNFT.approve(buyer2, 1, { from: buyer1 })
  await timelessNFT.transferFrom(buyer1, buyer2, 1, { from: buyer2, value: salePrice })

  console.log(`Transfer complete!\n`)

  deployerBal = await web3.eth.getBalance(deployer)
  artistBal = await web3.eth.getBalance(artist)
  buyer1Bal = await web3.eth.getBalance(buyer1)
  buyer2Bal = await web3.eth.getBalance(buyer2)

  console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer1   | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer2   | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  callback()
}
