import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userSchema from "../models/User.js";

const authentication = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(
        { message: "unauthorized" }
      );
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userSchema
      .findById(decodedToken?._id)
      .select("-password");
    if (!user) {
      return res.status(401).json(
        { message: 'invalidToken'}
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      { message: error.message }
    );
  }
};

export { authentication };
