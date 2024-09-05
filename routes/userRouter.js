import { Router } from "express";
import { deleteData, readData, updateData, uploadData, } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=new Router();
router.route("/create").post(uploadData)

router.route("/update").post(updateData)

router.route("/read").post(readData)

router.route("/delete").post(deleteData)

export default router