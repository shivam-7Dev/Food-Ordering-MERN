import { Request, Response } from "express";
import User from "../models/user";

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

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name, addressLine1, country, city } = req.body;
    /**
     * once we have the data next step is get the user from the database and update it
     * If no user is found the send error message
     */
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //update the User object
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    //once you have updated the user then save it

    await user.save();

    //send back the updated user
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error updating the user",
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // fetch the user form the database
    const currentUser = await User.findOne({
      _id: req.userId,
    });
    if (!currentUser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json(currentUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching the user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
