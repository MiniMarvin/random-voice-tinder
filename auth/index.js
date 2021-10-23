// setup the necessary browser environment for the cognito lib to work
global.fetch = require('node-fetch')
global.navigator = () => null

// setup the cognito login lib
require('cross-fetch/polyfill');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// JWT verification
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const pem = jwkToPem(jwk);

const poolData = {
  UserPoolId: `${process.env.USER_POOL_ID}`,
  ClientId: `${process.env.APP_CLIENT_ID}`
};
const poolRegion = `${process.env.POOL_REGION}`;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.validateToken = (token) => {
  return new Promise((acc, rej) => {
    request({
      url: `https://cognitoidp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json: true
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        rej(error)
        return
      }

      const decodedJwt = jwt.decode(token, { complete: true })
      if (!decodedJwt) {
        rej('Not a valid JWT token')
        return
      }

      const kid = decodedJwt.header.kid
      const keys = body['keys']
      const pems = keys.filter((key => key.kid === kid))
        .map(key => jwkToPem({ kty: key.kty, n: key.n, e: key.e }))

      const pem = pems[0]
      if (!pem) {
        rej('Invalid token')
        return
      }

      jwt.verify(token, pem, function (err, payload) {
        if (err) {
          rej('Invalid token')
        } else {
          acc("Valid token")
        }
      })
    })
  })
}

/**
 * 
 * @param {string} name username.
 * @param {string} password user password.
 * @returns {string}
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
        const token = res.getAccessToken().getJwtToken()
        acc(token)
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
