// Reference: https://aws.amazon.com/pt/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/
'use strict'
module.exports.audioService = (region) => {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: region })
  const s3 = new AWS.S3()

  // Change this value to adjust the signed URL's expiration
  const URL_EXPIRATION_SECONDS = 300

  /**
   * Get a signed URL with timeout for the users to be able to upload and retrieve data from the bucket.
   * @param {string} bucket The bucket where the operation is desired.
   * @param {string} filePath The bucket file path to the user to get info.
   * @param {string} contentType The content type of the file that the user is uploading.
   * @param {boolean} shouldUpload Defines if the link is for uploading or retrieving data.
   * @returns {Promise<{uploadURL: string, path: string}>}
   */
  const getSignedURL = async function(bucket, filePath, contentType, shouldUpload) {
    const Key = filePath

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

    return {
      uploadURL: uploadURL,
      path: Key
    }
  }

  return {
    getSignedURL
  }
}