// route.js

import express from "express";
import { userRegistration, userLogin } from "../Controllers/controllers.js";

const router = express.Router();

router.post("/signup", userRegistration);
router.post("/login", userLogin);

export default router;
