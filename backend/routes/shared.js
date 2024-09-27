import express from 'express';
import { fileUpload } from '../controllers/file.js';
import { upload } from '../middlewares/upload.js';
const router = express.Router();

/* GET home page. */
router.post("/fileUpload",upload.array("images"),fileUpload);


export default router;