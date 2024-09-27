import fileSchema from "../models/Files.js";
import {
  uploadImageToFirebase,
} from "../middlewares/upload.js";
import sharedSchema from "../models/Shared.js";

export const fileUpload = async (req, res) => {
  const { fileName } = req.body;
  console.log(req.body);

  try {
    const file = await fileSchema.exists({ fileName: fileName });
    if (file) {
      return res.status(409).json({ message: "already exist" });
    }
    console.log(file);

    let owner = req.user._id;

    // Handle file uploads (if any)
    let files = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadedImages = await Promise.all(
          req.files.map((file) => uploadImageToFirebase(file, owner))
        );
        files = uploadedImages; // Store the URLs of uploaded images
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
      }
    }
    console.log(files);

    // Create a new book entry
    const newFile = await fileSchema.create({
      fileName,
      owner,
      files,
    });

    return res.status(201).json({ message: "file created", file: newFile });
  } catch (error) {
    console.log({ error });

    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[field];
      const message = res.__("duplicateExist", {
        field: field,
        duplicateValue: duplicateValue,
      });
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const owner = req.user._id;
    console.log(owner);
    const files = await fileSchema.find({ owner: owner });

    return res.status(200).json({
      message: "succes",
      result: files,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const giveAccess = async (req, res) => {
  let { fileId, sharedUserId } = req.body;

  try {
    const sharedFile = await sharedSchema.findOne({ fileId: fileId });

    let newSharedFile;

    if (sharedFile) {
      const isAlreadyShared = sharedFile.shared.includes(sharedUserId);

      if (isAlreadyShared) {
        return res
          .status(400)
          .json({ message: "User already has access to the file" });
      }

      newSharedFile = await sharedSchema.findOneAndUpdate(
        { fileId: fileId },
        { $push: { shared: sharedUserId } },
        { new: true }
      );
    } else {
      const file = await fileSchema.findById(fileId);

      newSharedFile = new sharedSchema({
        fileUrl: file.files[0],
        fileId,
        shared: [sharedUserId],
        ownerId: req.user._id,
      });
      await newSharedFile.save();
    }

    return res
      .status(200)
      .json({ message: "Access granted to the user", file: newSharedFile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const sharedAllFiles = async (req, res) => {
  try {
    const sharedFiles = await sharedSchema.find({ ownerId: req.user._id });

    await sharedAllFiles.populate("shared", "username email");
    return res.status(200).json({ files: sharedFiles });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
