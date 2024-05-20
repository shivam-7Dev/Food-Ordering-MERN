import express from "express";
import MyUserController from "../controller/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();
//  route to create user
router.post("/", jwtCheck, MyUserController.createCurrentUser);

//  route to update user
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

// route to get current user
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

export default router;
