import { Router } from "express";
import { signIn, signUp, getUsers, getSpecificUser } from "../controllers/user.controller.js";

const router = Router();

router.route('/signup').post(signUp);
router.route("/signin").post(signIn);
router.route('/').get(getUsers);
router.route("/:id").get(getSpecificUser);

export default router;