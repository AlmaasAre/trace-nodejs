var expect = require('chai').expect
var reservoirSampler = require('./reservoir')

describe('The Reservoir Sampler', function () {
  var itemToAdd = {
    name: 'John Coin'
  }

  describe('when seen count is below the size limit', function () {
    it('adds the item', function () {
      var sampler = reservoirSampler.create(3)
      var isAdded = sampler.add(itemToAdd)

      expect(isAdded).to.eql(true)
      expect(sampler.flush()).to.eql([itemToAdd])
    })
  })

  describe('when seen count is above the size limit', function () {
    it('adds the item if selected', function () {
      this.sandbox.stub(Math, 'random', function () {
        return 0
      })
      var sampler = reservoirSampler.create(1)
      sampler._itemsSeen = 1
      var isAdded = sampler.add(itemToAdd)
      expect(isAdded).to.eql(true)
    })

    it('discards the item if not selected', function () {
      this.sandbox.stub(Math, 'random', function () {
        return 1
      })
      var sampler = reservoirSampler.create(1)
      sampler._itemsSeen = 1
      var isAdded = sampler.add(itemToAdd)
      expect(isAdded).to.eql(false)
    })
  })
})
