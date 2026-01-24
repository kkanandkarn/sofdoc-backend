import express from "express";
import {
  activateAccount,
  getLinkDetails,
  login,
  register,
  resendRegistrationRequest,
} from "../../controllers";
import dispatcher from "../../middleware/dispatcher";
const router = express.Router();

router.post("/login", (req, res, next) => {
  dispatcher({ req, res, next, func: login });
});
router.post("/register", (req, res, next) => {
  dispatcher({ req, res, next, func: register });
});
router.post("/link-details", (req, res, next) => {
  dispatcher({ req, res, next, func: getLinkDetails });
});
router.post("/resend-registration-request", (req, res, next) => {
  dispatcher({ req, res, next, func: resendRegistrationRequest });
});
router.post("/activate-account", (req, res, next) => {
  dispatcher({ req, res, next, func: activateAccount });
});

export default router;
