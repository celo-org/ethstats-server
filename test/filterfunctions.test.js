netStatsApp = {}

const assert = require('assert')
require('../src/js/filterfunctions')

describe('filterfunctions', () => {
  describe('#peerClass()', () => {

    it('should return text-gray if not active', () => {

      const pc = netStatsApp.peerClass(null, false)
      assert.equal(pc, 'text-gray')
    })

    it('should return text-gray if active', () => {

      const pc = netStatsApp.peerClass(null, true)
      assert.equal(pc, 'text-danger')
    })

  })
})