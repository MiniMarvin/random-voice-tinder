'use strict'

const { pushToQueue } = require('../manage-aws/manageSqs')

module.exports.profileServiceFactory = (region) => {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: region })
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

  // 4h TTL for the link
  const URL_EXPIRATION_SECONDS = 14400
  const CREATE_USER_QUEUE = process.env.CREATE_USER_QUEUE
  const USERS_TABLE = process.env.USERS_TABLE


  const enqueueProfileCreation = (event) => {
    return pushToQueue(event, CREATE_USER_QUEUE, sqs)
  }
  
  /**
   * Set a list of profiles in batch.
   * @param {{userId: string, name: string}[]} userPairs 
   */
  const setProfiles = (userPairs) => {
    const putRequests = userPairs.map(userPair => ({
      PutRequest: {
        Item: {
          id: userPair.userId,
          name: userPair.name,
          chats: []
        }
      }
    }))
    const payload = {
      RequestItems: {}
    }
    payload.RequestItems[USERS_TABLE] = putRequests
    
    ddb.batchWriteItem(payload, (err, _) => {
      const users = userPairs.map(userPair => userPair.userId)
      if (err) {
        console.err(`insertion failed to users ${users}.`)
        throw err
      } else {
        console.log(`insertion OK for the user ${users}.`)
      }
    })
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
    enqueueProfileCreation,
    setProfiles
  }
}