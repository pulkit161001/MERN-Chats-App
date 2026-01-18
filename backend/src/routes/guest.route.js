import express from "express";
import { getRandomGuestUser } from "../controllers/guest.controller.js";

const router = express.Router();
router.get("/random", getRandomGuestUser);
export default router;
