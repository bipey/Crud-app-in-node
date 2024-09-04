import { Router } from "express";
import { deleteData, logoutUser, readData, refreshAccessToken, updateData, uploadData, userLogin } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=new Router();
router.route("/create").post(uploadData)

router.route("/update").post(updateData)

router.route("/read").post(readData)

router.route("/delete").post(deleteData)

router.route("/login").post(userLogin)

router.route("/logout").post(verifyJwt, logoutUser)


router.route("/refresh").post(refreshAccessToken)
export default router