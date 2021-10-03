const authenticate = (token) => {
  console.log(JSON.stringify(token))
  return true;
}

const unauthPayload = () => {
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

export {unauthPayload}
export default authenticate