import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyPassport,
  verifyPassportBySignature,
} from "../controllers/passportController.js";

const router = express.Router();

// Student authenticated passport
router.get("/me", protect, getMyPassport);

// Public verification endpoint
router.get("/verify/:signature", verifyPassportBySignature);

export default router;
