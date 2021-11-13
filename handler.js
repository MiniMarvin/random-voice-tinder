'use strict';

const { audioServiceFactory } = require("./audio-service");
const { profileServiceFactory } = require('./profile-service')
const { unauthPayload, signUpUser, signInUser } = require("./auth/index.js");
const { v4: uuid } = require('uuid')
const audioService = audioServiceFactory(process.env.AWS_REGION)
const profileService = profileServiceFactory(process.env.AWS_REGION)

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  }
}

module.exports.putAudioAuth = async (event) => {
  // const auth = validateToken(event?.headers?.Authorization)
  const auth = true
  if (!auth) {
    return unauthPayload()
  }

  const filePath = `public/${uuid()}.mp3`
  // TODO: get audio type
  const contentType = 'audio/mpeg'
  const shouldUpload = true
  const signedPayload = await audioService.getSignedURL(process.env.AUDIOS_BUCKET, filePath, contentType, shouldUpload)
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload)
  }
}

module.exports.signUp = async (event) => {
  const body = JSON.parse(event.body)
  const username = body.username
  const email = body.email
  const password = body.password
  const user = await signUpUser(username, email, password)
  return {
    statusCode: 200,
    body: JSON.stringify(
      { user: user, },
      null,
      2
    ),
  }
}

module.exports.signIn = async (event) => {
  const body = JSON.parse(event.body)
  const username = body.username
  const password = body.password
  const tokens = await signInUser(username, password)
  return {
    statusCode: 200,
    body: JSON.stringify(
      tokens,
      null,
      2
    ),
  }
}

// TODO: separate the http handler from the non http handlers or separate by domain
module.exports.enqueueUserCreation = async (event) => {
  console.log(JSON.stringify(event))
  await profileService.enqueueProfileCreation(event)
}

module.exports.createUserOnDB = async (event) => {
  console.log(JSON.stringify(event))
  const records = event.Records
  const userPairs = records.map(record => {
    const user = JSON.parse(record.body)
    const email = user.request.userAttributes.email
    const userId = user.request.userAttributes.sub
    const name = user.request.userAttributes.name || email.split("@")[0]
    return { userId, name }
  })
  for (let userPair of userPairs) {
    // TODO: make this message get back to queue if there's an issue
    profileService.setProfiles(userPair.userId, userPair.name)
  }

}