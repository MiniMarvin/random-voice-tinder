const { expect } = require("@jest/globals")
const { audioService } = require("../audio-service")
const {v4: uuid} = require('uuid')

test('should ', () => {
  const service = audioService('us-east-1')
  expect(service != null).toBe(true)
  expect(service.getSignedURL != null).toBe(true)
})
