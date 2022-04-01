const Adulam = artifacts.require('Adulam')

module.exports = async function (deployer) {
  const BASEURI = `https://bafybeidfpvjszubegtoomoknmc7zcqnay7noteadbwxktw46guhdeqohrm.ipfs.infura-ipfs.io/`

  await deployer.deploy(Adulam, 'Adulam', 'ADU', BASEURI)
}
