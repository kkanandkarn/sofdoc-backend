import express from "express";
import { login } from "../../controllers";
import dispatcher from "../../middleware/dispatcher";
const router = express.Router();

router.post("/login", (req, res, next) => {
  dispatcher({ req, res, next, func: login });
});

export default router;
