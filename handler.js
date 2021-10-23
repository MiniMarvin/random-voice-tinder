'use strict';

const { audioService } = require("./audio-service");
const { validateToken, unauthPayload, signUpUser, signInUser } = require("./auth/index.js");
const localAudioService = audioService(process.env.AWS_REGION)
const { v4: uuid } = require('uuid')

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
  const signedPayload = await localAudioService.getSignedURL(process.env.AUDIOS_BUCKET, filePath, contentType, shouldUpload)
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
  const token = await signInUser(username, password)
  return {
    statusCode: 200,
    body: JSON.stringify(
      { token: token, },
      null,
      2
    ),
  }
}