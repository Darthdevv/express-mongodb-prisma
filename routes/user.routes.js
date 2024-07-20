import { Router } from "express";
import { signIn, signUp, getUsers, getSpecificUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import authenticationHandler from "../middlewares/auth/authentication.middleware.js";
const router = Router();

router.route('/signup').post(signUp);
router.route("/signin").post(signIn);
router.route('/').get(getUsers);
router.route("/:id").get(getSpecificUser).patch(authenticationHandler, updateUser).delete( authenticationHandler, deleteUser);

export default router;