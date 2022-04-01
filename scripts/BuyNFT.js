const Adulam = artifacts.require('Adulam')

const toWei = (num) => web3.utils.toWei(num.toString())
const fromWei = (num) => web3.utils.fromWei(num.toString())

module.exports = async (callback) => {
  const [deployer, buyer1] = await web3.eth.getAccounts()

  const COST = toWei(0.01)
  const TITLE = 'Soul McCullough'
  const DESCRIPTION =
    'engineer efficient solutions with this NFT, created for Public-key'

  const adulam = await Adulam.deployed()

  let deployerBal = await web3.eth.getBalance(deployer)
  let buyer1Bal = await web3.eth.getBalance(buyer1)

  console.log(
    `Initial balance of deployer | ${web3.utils.fromWei(
      deployerBal.toString(),
      'ether'
    )}`
  )
  console.log(
    `Initial balance of buyer1   | ${web3.utils.fromWei(
      buyer1Bal.toString(),
      'ether'
    )}\n`
  )

  console.log(`Minting NFT for buyer1...\n`)

  await adulam.payToMint(TITLE, DESCRIPTION, { from: buyer1, value: COST })

  console.log(`Balance after NFT minting!\n`)
  deployerBal = await web3.eth.getBalance(deployer)
  buyer1Bal = await web3.eth.getBalance(buyer1)

  console.log(
    `Later balance of deployer | ${web3.utils.fromWei(
      deployerBal.toString(),
      'ether'
    )}`
  )
  console.log(
    `Later balance of buyer1   | ${web3.utils.fromWei(
      buyer1Bal.toString(),
      'ether'
    )}`
  )

  console.log(`Newly Minted Token Details!\n`)

  const balance = await adulam.balanceOf(buyer1)
  console.log(`Buyer1 has ${balance} tokens...\n`)

  callback()
}
