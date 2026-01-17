import express from "express";
import { login, register } from "../../controllers";
import dispatcher from "../../middleware/dispatcher";
const router = express.Router();

router.post("/login", (req, res, next) => {
  dispatcher({ req, res, next, func: login });
});
router.post("/register", (req, res, next) => {
  dispatcher({ req, res, next, func: register });
});

export default router;
