// route.js

import express from "express";
import { userRegistration, userLogin } from "../Controllers/userOauthController.js";

const router = express.Router();

router.post("/signup", userRegistration);
router.post("/login", userLogin);

export default router;
