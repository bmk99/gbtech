import mongoose from "mongoose";

const { Schema } = mongoose;
const sharedSchema = new Schema(
  {
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "Files",
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "Files",
      },
    shared: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fileUrl :{
        type : String, 
    }
  },
  {
    timestamps: true,
  }
);

const file = mongoose.model("Shared", sharedSchema);

export default file;
