// routes/stripe.js

import express from "express";
import payment from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", payment);

export default router;
