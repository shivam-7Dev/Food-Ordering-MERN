import express, { Request, Response } from "express";
import Cors from "cors";
import "dotenv/config";

/**
 * creating a new express server and assigning it to app variable
 */
const app = express();

/**
 * adding middleware to convert body on any request frontend makes into json
 * use app.use() to add a middleware
 * NOTE=> we are using this middlware at the begining so that every request is converted at the very beggining
 * and we dont have to do it manually to every request
 */
app.use(express.json());

/**
 * setting up the cors middle ware
 */
app.use(Cors());

/**
 * setting up the test endpoint
 */

app.get("/test", async (req: Request, res: Response) => {
  /**
   * sending our first request
   */
  res.json({ message: "hello world" });
});

app.listen(7000, () => {
  console.log("server listning on port 7000");
});
