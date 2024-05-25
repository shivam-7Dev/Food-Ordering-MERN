import Restaurant from "../models/restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

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

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    // find the restaurant you want to update
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    // update all the individual fields of the restaurant
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant };
