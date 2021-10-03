'use strict';

const { default: audioService } = require("./audio-service");
const { default: authenticate, unauthPayload } = require("./auth");
const localAudioService = audioService(process.env.AWS_REGION)
const { uuid } = require('uuidv4')

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
  const auth = authenticate(event?.headers?.Authorization)
  if (!auth) {
    return unauthPayload()
  }

  const filePath = `public/${uuid()}.json`
  // TODO: get audio type
  const contentType = 'audio/mpeg'
  const shouldUpload = true
  const signedPayload = await localAudioService.getSignedURL(process.env.AUDIOS_BUCKET, filePath, contentType, shouldUpload)
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload)
  }
}
