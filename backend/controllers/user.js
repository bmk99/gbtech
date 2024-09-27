import jwt from "jsonwebtoken";
import userSchema from "../models/User.js";
import otpGenerator from "otp-generator";
import { transporter } from "../config/emailconfig.js";
import Code from "../models/Code.js";
const registerUser = async (req, res) => {
  try {
    const { firstName,lastName, email, password } = req.body;

const username = firstName + lastName
    const existedUser = await userSchema.findOne({ email: email });

    if (existedUser) {
      return res.status(209).json({ message: "UserExist" });
    }
    const user = await userSchema.create({
      username: username.toLowerCase(),
      email,
      password,
    });
    const createdUser = await userSchema
      .findById(user._id)
      .select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({ message: "error while crating the user" });
    }

    return res
      .status(201)
      .json({ message: "succesfully created", result: createdUser });
  } catch (error) {
    console.log(error);

    // Handle duplicate entry error
    if (error.name == "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[field];
      const message = `${duplicateValue}  is exist for the ${field}`;
      return res.status(400).json({ message: message });
    }

    // Handle validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      console.log(errors.join(""));

      return res.status(400).json({ message: errors.join(", ") });
    }

    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)

    if (!email && !password) {
      return res.status(500).json({ messages: "required" });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "please check your password" });
    }
    const accessToken = user.generateAccessToken();

    const loggedInUser = await userSchema
      .findById(user._id)
      .select("-password");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      message: "User Created Succesfully",
      result: loggedInUser,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(205)
      .clearCookie("accessToken", options)
      .json({ message: "logout succesfully" });
  } catch (error) {
    return res.status(500).json({ messages: error.message });
  }
};

const sentOtp = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`Generated OTP: ${otp}`);

    const isExistCode = await Code.findOne({ email: req.body.email });
    if (isExistCode) {
      await Code.findByIdAndUpdate(
        isExistCode._id,
        { code: otp },
        { new: true }
      );
    } else {
      const newCode = new Code({
        email: req.body.email,
        code: otp,
        createdAt: new Date(),
      });
      await newCode.save();
    }

    //----------- Send OTP via Email --------------
    const mailOptions = {
      from: "your-email@gmail.com", 
      to: [req.body.email],
      subject: "Verification Code",
      template: "VerifyGmail", // Name of the template file (email.handlebars)
      context: {
        otp: otp.split(""), 
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Mail Error:", error);
        return res
          .status(500)
          .json({ message: "Failed to send verification code. Try again." });
      } else {
        console.log("Mail Info:", info);
        return res
          .status(200)
          .json({ message: "Verification code sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error in OTP generation:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const codeFile = await Code.findOne({ email });
    if (!codeFile) {
      return res.status(400).json({ message: "Email not found." });
    }

    const otpFromDatabase = codeFile.code;
    if (otpFromDatabase === code) {

      const createdAt = new Date(codeFile.createdAt);
      const now = new Date();
      const diffMinutes = Math.floor((now - createdAt) / 60000); // Difference in minutes
      if (diffMinutes > 5) {
        return res.status(400).json({ message: "OTP has expired." });
      }

      await Code.findByIdAndDelete(codeFile._id);
      return res.status(200).json({ message: "OTP verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error in OTP verification:", error.message);
    return res.status(500).json({ message: error.message });
  }
};


export { registerUser, loginUser, logoutUser, sentOtp, verifyOtp };
