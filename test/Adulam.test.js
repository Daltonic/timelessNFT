const Adulam = artifacts.require('Adulam')

require('chai').use(require('chai-as-promised')).should()

const toWei = (num) => web3.utils.toWei(num.toString())
const fromWei = (num) => web3.utils.fromWei(num.toString())

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('Adulam', ([deployer, buyer1]) => {
  const COST = toWei(0.01)
  const _NAME = 'Adulam'
  const _SYMBOL = 'ADU'
  const _BASE_URI =
    'https://bafybeidfpvjszubegtoomoknmc7zcqnay7noteadbwxktw46guhdeqohrm.ipfs.infura-ipfs.io/'

  const TITLE = 'Soul McCullough'
  const DESCRIPTION =
    'engineer efficient solutions with this NFT, created for Public-key'

  let adulam, result

  beforeEach(async () => {
    adulam = await Adulam.new(_NAME, _SYMBOL, _BASE_URI)
  })

  describe('deployment', () => {
    it('confirms NFT name', async () => {
      result = await adulam.name()
      result.should.equal(_NAME)
    })

    it('confirms NFT symbol', async () => {
      result = await adulam.symbol()
      result.should.equal(_SYMBOL)
    })

    it('confirms NFT baseURI', async () => {
      result = await adulam.baseURI()
      result.should.equal(_BASE_URI)
    })

    it('confirms NFT owner', async () => {
      result = await adulam.owner()
      result.should.equal(deployer)
    })

    it('confirms NFT mint cost', async () => {
      result = await adulam.cost()
      result.toString().should.equal(COST)
    })
  })

  describe('Minting', () => {
    describe('Success', () => {
      beforeEach(async () => {
        result = await adulam.payToMint(TITLE, DESCRIPTION, {
          from: buyer1,
          value: COST,
        })
      })

      it('Confirms buyer owns minted token', async () => {
        result = await adulam.ownerOf(1)
        result.should.equal(buyer1)
      })

      it('Confirms supply increase by 1', async () => {
        result = await adulam.supply()
        result.toString().should.equal('1')
      })

      it('Returns NFT array', async () => {
        result = await adulam.getAllNFTs()
        result.length.toString().should.equal('1')
      })

      it('Returns an NFT object', async () => {
        result = await adulam.getAnNFTs(1)
        result.length.toString().should.equal('7')
      })
    })

    describe('Failure', () => {
      it('Prevents mint with 0 value', async () => {
        await adulam
          .payToMint(TITLE, DESCRIPTION, { from: buyer1, value: 0 })
          .should.be.rejectedWith(EVM_REVERT)
      })

      it('Prevents minting by deployer', async () => {
        await adulam
          .payToMint(TITLE, DESCRIPTION, { from: deployer, value: COST })
          .should.be.rejectedWith(EVM_REVERT)
      })
    })
  })
})
