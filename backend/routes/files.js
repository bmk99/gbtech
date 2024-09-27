import express from 'express';
import { fileUpload, getAllFiles, giveAccess, sharedAllFiles } from '../controllers/file.js';
import { upload } from '../middlewares/upload.js';
const router = express.Router();


router.post("/fileUpload",upload.array("images"),fileUpload);
router.get("/getAll",getAllFiles);
router.post("/giveAccess",giveAccess);
router.get("/giveAccess",sharedAllFiles);


export default router;