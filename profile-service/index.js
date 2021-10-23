'use strict'
module.exports.profileService = (region) => {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: region })
  const s3 = new AWS.S3()

  // 4h TTL for the link
  const URL_EXPIRATION_SECONDS = 14400
  
  const setProfile = (userId) => {

  }

  /**
   * @returns {{name: string, age: int}}
   */
  const getProfile = (userId) => {

  }

  const getAudio = (userId) => {

  }

  const getProfileAudioSignedUrl = (userId) => {

  }

  return {
    getSignedURL
  }
}