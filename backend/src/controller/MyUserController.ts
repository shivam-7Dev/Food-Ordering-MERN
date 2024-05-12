import { Request, Response } from "express";
import User from "../models/models";

const createCurrentUser = async (req: Request, res: Response) => {
  /**
   * 1. check if the user exists
   * 2. creste the user if doesn't exist
   * 3. return the user object to the calling clinet
   */
  try {
    const { auth0Id } = req.body;
    //check if user exist and if yes then just send 200
    const existingUser = await User.findOne({
      auth0Id: auth0Id,
    });

    if (existingUser) return res.status(200).send();

    // If user does not exist then create a new user and save it
    const newUser = new User(req.body);
    await newUser.save();

    /*
     * return the newly added user,
     *201 means created
     *toObject() Converts this document into a plain-old JavaScript object
     */
    return res.status(201).json(newUser.toObject());
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating user",
    });
  }
};

export default {
  createCurrentUser,
};
