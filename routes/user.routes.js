import { Router } from "express";
import { signIn, signUp, getUsers } from "../controllers/user.controller.js";

const router = Router();

router.route('/signup').post(signUp);
router.route("/signin").post(signIn);
router.route('/').get(getUsers);

export default router;