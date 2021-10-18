'use strict';

const { audioService } = require("./audio-service");
const { authenticate, unauthPayload } = require("./auth");
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
  const auth = authenticate(event?.headers?.Authorization)
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
