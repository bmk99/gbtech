import mongoose from "mongoose";
const { Schema } = mongoose;

const codeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
  },
});

const code = new mongoose.model("Code", codeSchema);
export default code;
