import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique : true,
      required :[true, "Name is Required"]
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"], // Minimum length validation
    },
    verified:{
        type: Boolean, 
        default : false
    }
    // phone: {
    //   type: Number,
    //   required: true,
    //   trim: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^\d{10}$/.test(v);  // RegExp for exactly 10 digits
    //     },
    //     message: (props) => `${props.value} is not a valid 10-digit phone number!`,
    //   },
    // },
  },
  {
    timestamps: true,
  }
);



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};




const user = mongoose.model("User", userSchema);
export default user