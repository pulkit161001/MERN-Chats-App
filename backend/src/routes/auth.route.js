import express from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//if they are logged in
router.post("/update-profile", protectRoute, updateProfile);

// check whether user is authenticated
router.get("/check", protectRoute, checkAuth);

export default router;
