/* eslint-disable no-undef */
const TimelessNFT = artifacts.require('TimelessNFT')

module.exports = async (deployer) => {
  const [_deployer, _artist] = await web3.eth.getAccounts()

  const _name = 'Timeless NFTs'
  const _symbol = 'TNT'
  const _royalityFee = 10

  await deployer.deploy(
    TimelessNFT,
    _name,
    _symbol,
    _royalityFee,
    _deployer,
    _artist
  )
}
