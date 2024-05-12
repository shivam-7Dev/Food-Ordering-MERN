const { auth } = require("express-oauth2-jwt-bearer");

/**
 * auth() function checks the authorization headers from the bearer token
 * It is a handler function which is used as a middleware
 * app.use(jwtCheck)
 * the values to the keys should come from environment variables instead of hardcoding them
 */

const jwtCheck = auth({
  audience: process.env.Auth0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export { jwtCheck };
