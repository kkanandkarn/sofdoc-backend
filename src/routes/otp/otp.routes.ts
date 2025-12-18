import express from "express";
import { sendOtp, verifyOtp } from "../../controllers";
import dispatcher from "../../middleware/dispatcher";
const router = express.Router();

router.post(
  "/send-otp",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    dispatcher({ req, res, next, func: sendOtp });
  },
);

router.post(
  "/verify-otp",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    dispatcher({ req, res, next, func: verifyOtp });
  },
);

export default router;
