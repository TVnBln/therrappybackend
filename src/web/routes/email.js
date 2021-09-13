import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const WelcomeMail = (req, res) => {
  SendMail("welcome", req.body);
  res.json({ message: "Welcome" });
};

const ForgotPassword = (req, res) => {
  SendMail("forgotPassword", req.body);
  res.json({ message: "Forgot Password", code: req.body.code });
};

router.post("/welcome", WelcomeMail);
router.post("/forgotPassword", ForgotPassword);

export default router;
