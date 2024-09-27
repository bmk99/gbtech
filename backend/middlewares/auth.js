import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userSchema from "../models/User.js";

const authentication = async (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization Failed" });
    }
    const accesToken = header.split(" ");
    const token = accesToken[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

export { authentication };
