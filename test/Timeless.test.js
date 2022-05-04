const TimelessNFT = artifacts.require('TimelessNFT')

require('chai').use(require('chai-as-promised')).should()

const toWei = (num) => web3.utils.toWei(num.toString())
const fromWei = (num) => web3.utils.fromWei(num.toString())

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('TimelessNFT', ([_deployer, _artist, buyer1, buyer2]) => {
  const COST = toWei(0.01)
  const _NAME = 'TimelessNFT'
  const _SYMBOL = 'TNT'
  const _ROYALTYFEE = 7
  const METADATAURI =
    'https://bafybeidfpvjszubegtoomoknmc7zcqnay7noteadbwxktw46guhdeqohrm.ipfs.infura-ipfs.io/1.json'

  const TITLE = 'Soul McCullough'
  const DESCRIPTION =
    'engineer efficient solutions with this NFT, created for Public-key'
  const SALESPRICE =  web3.utils.toWei('3', 'ether')

  let timelessNFT, result

  beforeEach(async () => {
    timelessNFT = await TimelessNFT.new(_NAME, _SYMBOL, _ROYALTYFEE, _artist)
  })

  describe('deployment', () => {
    it('confirms NFT name', async () => {
      result = await timelessNFT.name()
      result.should.equal(_NAME)
    })

    it('confirms NFT symbol', async () => {
      result = await timelessNFT.symbol()
      result.should.equal(_SYMBOL)
    })

    it('confirms NFT artist', async () => {
      result = await timelessNFT.artist()
      result.should.equal(_artist)
    })

    it('confirms NFT owner', async () => {
      result = await timelessNFT.owner()
      result.should.equal(_deployer)
    })

    it('confirms NFT mint cost', async () => {
      result = await timelessNFT.cost()
      result.toString().should.equal(COST)
    })

    it('confirms NFT royalty fee', async () => {
      result = await timelessNFT.royalityFee()
      result.toString().should.equal(_ROYALTYFEE.toString())
    })
  })

  describe('Minting', () => {
    describe('Success', () => {
      beforeEach(async () => {
        result = await timelessNFT.payToMint(TITLE, DESCRIPTION, METADATAURI, SALESPRICE, {
          from: buyer1,
          value: COST,
        })
      })

      it('Confirms buyer owns minted token', async () => {
        result = await timelessNFT.ownerOf(1)
        result.should.equal(buyer1)
      })

      it('Confirms supply increase by 1', async () => {
        result = await timelessNFT.supply()
        result.toString().should.equal('1')
      })

      it('Returns NFT array', async () => {
        result = await timelessNFT.getAllNFTs()
        result.length.toString().should.equal('1')
      })
    })

    describe('Failure', () => {
      it('Prevents mint with 0 value', async () => {
        await timelessNFT
          .payToMint(TITLE, DESCRIPTION, METADATAURI, SALESPRICE, {
            from: buyer1,
            value: 0,
          })
          .should.be.rejectedWith(EVM_REVERT)
      })

      it('Prevents minting by deployer', async () => {
        await timelessNFT
          .payToMint(TITLE, DESCRIPTION, METADATAURI, SALESPRICE, {
            from: _deployer,
            value: COST,
          })
          .should.be.rejectedWith(EVM_REVERT)
      })
    })
  })

  describe('Transfering', () => {
    describe('Success', () => {
      beforeEach(async () => {
        result = await timelessNFT.payToMint(TITLE, DESCRIPTION, METADATAURI, SALESPRICE, {
          from: buyer1,
          value: COST,
        })
      })

      it('Confirms token transfer', async () => {
        await timelessNFT.approve(buyer2, 1, { from: buyer1 })
        await timelessNFT.transferFrom(buyer1, buyer2, 1, { from: buyer2, value: SALESPRICE })
        result = await timelessNFT.ownerOf(1)
        result.should.equal(buyer2)
      })
    })
  })
})
