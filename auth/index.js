module.exports.authenticate = (token) => {
  console.log(JSON.stringify(token))
  return true;
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
