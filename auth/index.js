// setup the cognito login lib
require('cross-fetch/polyfill');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwt = require('jsonwebtoken')
const request = require('request')

const poolData = {
  UserPoolId: `${process.env.USER_POOL_ID}`,
  ClientId: `${process.env.APP_CLIENT_ID}`
};
const poolRegion = `${process.env.POOL_REGION}`;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/**
 * 
 * @param {string} name username.
 * @param {string} password user password.
 * @returns {{access_token: string, identity_token: string}}
 */
module.exports.signInUser = (name, password) => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: name,
    Password: password
  })

  const userData = {
    Username: name,
    Pool: userPool
  }

  const user = new AmazonCognitoIdentity.CognitoUser(userData)
  return new Promise((acc, rej) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (res) => {
        const access_token = res.getAccessToken().getJwtToken()
        const identity_token = res.getIdToken().getJwtToken()
        acc({ access_token, identity_token })
      },
      onFailure: (err) => {
        rej(err)
      }
    })
  })
}

/**
 * 
 * @param {string} name username
 * @param {string} email user email
 * @param {string} password user password
 * @returns {AmazonCognitoIdentity.CognitoUser}
 */
module.exports.signUpUser = (name, email, password) => {
  const attributeList = []
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: "email",
    Value: email
  }))

  return new Promise((acc, rej) => {
    userPool.signUp(name, password, attributeList, null, (err, res) => {
      if (err) rej(err)
      else acc(res.user)
    })
  })
}

module.exports.unauthPayload = () => {
  return {
    statusCode: 403,
    body: JSON.stringify(
      {
        message: 'You don\'t have necessary credentials to access this resource'
      },
      null,
      2
    ),
  }
}
