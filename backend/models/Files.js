import mongoose from "mongoose";

const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true,
    },
    files: [
      {
        type: String,
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shared: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const file = mongoose.model("Files", fileSchema);
export default file;
