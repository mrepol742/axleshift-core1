import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcryptjs from "bcryptjs";
import connectToDatabase from "../../models/db.js";
import logger from "../../src/logger.js";

const router = express.Router();

export default router;
