import Restaurant from "../models/restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("-----------");
    /**
     * Check if the user has an existing restaurant in the database
     * If yes then do not create the restaurant
     * because one user can create only one account
     */
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      //409 status means duplicate which means that record already exists
      return res
        .status(409)
        .json({ message: "user already have a restaurant" });
    }

    //extract  the image from the request
    const image = req.file as Express.Multer.File;
    //create a base64 of the above image
    const base64Image = Buffer.from(image.buffer).toString("base64");
    // settings for cloudinary
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //upload to cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    // create the restaurant
    const restaurant = new Restaurant(req.body);
    //saving the imageUrl
    restaurant.imageUrl = uploadResponse.url;
    //linking the user to the created restaurant record
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    await restaurant.save();

    //complete the request
    res.status(201).send(restaurant);
  } catch (error) {
    console.log("error creating restaurant", error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

export default { createMyRestaurant, getMyRestaurant };
