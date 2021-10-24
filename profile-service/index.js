'use strict'

const { pushToQueue } = require('../manage-aws/manageSqs')

module.exports.profileService = (region) => {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: region })
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

  // 4h TTL for the link
  const URL_EXPIRATION_SECONDS = 14400
  const CREATE_USER_QUEUE = process.env.CREATE_USER_QUEUE


  const enqueueProfileCreation = (event) => {
    return pushToQueue(event, CREATE_USER_QUEUE, sqs)
  }
  
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
    enqueueProfileCreation
  }
}