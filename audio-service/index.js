// Reference: https://aws.amazon.com/pt/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/
'use strict'
const audioService = (region) => {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: region })
  const s3 = new AWS.S3()

  // Change this value to adjust the signed URL's expiration
  const URL_EXPIRATION_SECONDS = 300

  const getSignedURL = async function(bucket, path, contentType, shouldUpload) {
    const Key = path
    // Get signed URL from S3
    const s3Params = {
      Bucket: bucket,
      Key,
      Expires: URL_EXPIRATION_SECONDS,
      ContentType: contentType,
    }

    console.log('Params: ', s3Params)
    const action = shouldUpload ? 'putObject' : 'getObject'
    const uploadURL = await s3.getSignedUrlPromise(action, s3Params)

    return JSON.stringify({
      uploadURL: uploadURL,
      Key
    })
  }
}

export default audioService