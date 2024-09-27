import express from 'express';
import { fileUpload, getAllFiles, giveAccess, sharedAllFiles } from '../controllers/file.js';
import { upload } from '../middlewares/upload.js';
import { authentication } from '../middlewares/auth.js';
const router = express.Router();

router.use(authentication)
router.post("/fileUpload",upload.array("images"),fileUpload);
router.get("/getAll/:id",getAllFiles);
router.post("/giveAccess",giveAccess);
router.get("/giveAccess",sharedAllFiles);


export default router;