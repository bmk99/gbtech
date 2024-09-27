import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

import multer from "multer";
import path from "path";
import { assert } from "console";

const bucketid = process.env.STORAGE_BUCKET_ID;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketid, // storage bucket URL
});

// Firestore Storage bucket instance
const bucket = admin.storage().bucket();
// Multer Configuration for File Upload
const storage = multer.memoryStorage(); // Memory storage for file handling

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileformat = path.extname(file.originalname);
    if (
      fileformat !== ".pdf" &&
      fileformat !== ".docs" &&
      fileformat !== ".jpeg" &&
      fileformat !== ".png"
    ) {
      return cb(
        new Error("Only .png, .jpg, and .jpeg formats are allowed!"),
        false
      );
    }
    cb(null, true);
  },
});

// Helper function to upload the image to Firebase
async function uploadImageToFirebase(file, userId) {
  try {
    console.log("upload");
    const fileName = `${userId}/${Date.now()}${file.originalname}`; // Unique file name
    const firebaseFile = bucket.file(fileName);
    const [signedUrl] = await firebaseFile.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Set expiration date far in the future
    });

    console.log(file);

    // Upload the file to Firebase storage
    const res = await firebaseFile.save(file.buffer, {
      resumable: false,
      contentType: file.mimetype,
    });
    console.log(res);
    return signedUrl;
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}



export { uploadImageToFirebase, upload, };
