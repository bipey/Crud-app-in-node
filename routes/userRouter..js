import { Router } from "express";
import { deleteData, readData, updateData, uploadData, userLogin } from "../controllers/user.controllers.js";
const router=new Router();
router.route("/create").post(uploadData)

router.route("/update").post(updateData)

router.route("/read").post(readData)

router.route("/delete").post(deleteData)

router.route("/login").post(userLogin)

export default router