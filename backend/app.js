// var createError = require('http-errors');
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'

import usersRouter from "./routes/users.js";
import fileRoutes from "./routes/files.js";
import { authentication } from "./middlewares/auth.js";

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
const options = {
  origin: "http://localhost:3000",
  useSucessStatus: 200,
};
app.use(cors(options));
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Failed to Connect - ${error}`);
  }

  app.use("/users", usersRouter);

  // app.use(authentication);

  app.use("/files", fileRoutes);

  app.listen(process.env.PORT, () => {
    console.log("server runnin ", process.env.PORT);
  });
}
main().catch((err) => console.log(err));
