/* eslint-disable no-undef */
const TimelessNFT = artifacts.require("TimelessNFT");

module.exports = async (callback) => {
  const [deployer, artist, buyer1, buyer2] = await web3.eth.getAccounts()

  const COST = web3.utils.toWei('0.01', 'ether')

  const timelessNFT = await TimelessNFT.deployed()

  const METADATAURI =
    'https://bafybeidfpvjszubegtoomoknmc7zcqnay7noteadbwxktw46guhdeqohrm.ipfs.infura-ipfs.io/3.json'

  const TITLE = 'Soul McCullough'
  const DESCRIPTION =
    'engineer efficient solutions with this NFT, created for Public-key'
  const SALESPRICE =  web3.utils.toWei('3', 'ether')

  let deployerBal = await web3.eth.getBalance(deployer)
  let artistBal = await web3.eth.getBalance(artist)
  let buyer1Bal = await web3.eth.getBalance(buyer1)
  let buyer2Bal = await web3.eth.getBalance(buyer2)

  console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer1   | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Initial balance of buyer2   | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  console.log(`Minting NFT for buyer1...\n`)

  await timelessNFT.payToMint(TITLE, DESCRIPTION, METADATAURI, SALESPRICE, {
    from: buyer1,
    value: COST,
  })

  console.log(`NFT has been minted!\n`)

  deployerBal = await web3.eth.getBalance(deployer)
  artistBal = await web3.eth.getBalance(artist)
  buyer1Bal = await web3.eth.getBalance(buyer1)
  buyer2Bal = await web3.eth.getBalance(buyer2)

  console.log(`Balance of deployer after mint | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Balance of artist   after mint | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Balance of buyer1   after mint | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Balance of buyer2   after mint | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  console.log(`Performing transfer sale to buyer2...\n`)

  await timelessNFT.approve(buyer2, 1, { from: buyer1 })
  await timelessNFT.transferFrom(buyer1, buyer2, 1, { from: buyer2, value: SALESPRICE })

  console.log(`Transfer complete!\n`)

  deployerBal = await web3.eth.getBalance(deployer)
  artistBal = await web3.eth.getBalance(artist)
  buyer1Bal = await web3.eth.getBalance(buyer1)
  buyer2Bal = await web3.eth.getBalance(buyer2)

  console.log(`Balance of deployer after transfer | ${web3.utils.fromWei(deployerBal.toString(), 'ether')}`)
  console.log(`Balance of artist   after transfer | ${web3.utils.fromWei(artistBal.toString(), 'ether')}`)
  console.log(`Balance of buyer1   after transfer | ${web3.utils.fromWei(buyer1Bal.toString(), 'ether')}`)
  console.log(`Balance of buyer2   after transfer | ${web3.utils.fromWei(buyer2Bal.toString(), 'ether')}\n`)

  callback()
}
