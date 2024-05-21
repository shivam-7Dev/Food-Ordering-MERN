import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
const { auth } = require("express-oauth2-jwt-bearer");

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

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

const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * step1: get the access tocken from the Authorization  header thats is the request
   * step2: decode the token to get the auth0 id from that access tocken
   * step3: once you have auth0 id get th monogodb document id from that auth0Id
   */

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    //return unauthorized status
    return res.sendStatus(401);
  }
  //Bearer sdf897s98f7as98df798798s7d
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

export { jwtCheck, jwtParse };
