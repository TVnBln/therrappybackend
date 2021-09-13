import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const register = (req, res) => {
  faunaQueries
    .register(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.username,
      req.body.bio,
      req.body.gender,
      req.body.phoneNumber,
      req.body.birthDay
    )
    .then((e) => {
      SendMail("welcome", req.body, null);
      const response = {
        user: e.user.data,
        secret: e.secret.secret,
        date: new Date(),
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      // return res.status(error.statusCode).json(
      //   generateError({
      //     error: error.type,
      //     method: error.method,
      //     reasons: [
      //       {
      //         reason: error.reason,
      //         message: error.message,
      //         data: error.data,
      //         location: error.location,
      //         description: error.description,
      //         requestContent: error.requestContent,
      //       },
      //     ],
      //   })
      // );
      return res.json(err);
    });
};

const login = (req, res) => {
  faunaQueries
    .login(req.body.email, req.body.password)
    .then((e) => {
      const response = {
        user: e.user.data,
        secret: e.secret,
        date: new Date(),
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.status(error.statusCode).json(
        generateError({
          error: error.type,
          method: error.method,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
              requestContent: error.requestContent,
            },
          ],
        })
      );
    });
};

const logout = (req, res) => {
  console.log("logout");
  faunaQueries
    .logout()
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.status(error.statusCode).json(
        generateError({
          error: error.type,
          method: error.method,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
              requestContent: error.requestContent,
            },
          ],
        })
      );
    });
};

const sendPasswordReset = (req, res) => {
  faunaQueries
    .forgotPassword(req.body.email)
    .then((e) => {
      SendMail("forgotPassword", req.body, e.data.data.code);
      return res.status(200).json({ code: e.data.data.code });
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.status(error.statusCode).json(
        generateError({
          error: error.type,
          method: error.method,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
              requestContent: error.requestContent,
            },
          ],
        })
      );
    });
};

const confirmPasswordReset = (req, res) => {
  faunaQueries
    .forgotPasswordReset(
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    )
    .then((e) => {
      return res
        .status(200)
        .json({ message: "Your password has been changed" });
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.status(error.statusCode).json(
        generateError({
          error: error.type,
          method: error.method,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
              requestContent: error.requestContent,
            },
          ],
        })
      );
    });
};

const resetPassword = (req, res) => {
  faunaQueries
    .resetPassword(req.body.password, req.body.confirmPassword)
    .then((e) => {
      return res.status(200).json({ message: "Your password has been reset" });
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.status(error.statusCode).json(
        generateError({
          error: error.type,
          method: error.method,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
              requestContent: error.requestContent,
            },
          ],
        })
      );
    });
};

router.post("/logout", logout);
router.post("/login", login);
router.post("/register", register);
router.post("/sendPasswordReset", sendPasswordReset);
router.post("/confirmPasswordReset", confirmPasswordReset);
router.post("/resetPassword", resetPassword);

export default router;
