import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const GetDefaultSettings = (req, res) => {
  const settings = faunaQueries.getDefaultSettings();
  res.json(settings);
};

const SetDefaultSettings = (req, res) => {
  faunaQueries
    .setDefaultSettings()
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.json(
        generateError({
          error: error.type,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
            },
          ],
        })
      );
    });
};

const GetCurrentSettings = (req, res) => {
  faunaQueries
    .getCurrentSettings()
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      const error = ResponseError(err, req.path);
      return res.json(
        generateError({
          error: error.type,
          reasons: [
            {
              reason: error.reason,
              message: error.message,
              data: error.data,
              location: error.location,
              description: error.description,
            },
          ],
        })
      );
    });
};

const SetCurrentSettings = (req, res) => {
  console.log(req.body);
  const settings = {
    pauseAll: req.body.notifications.pushNotifications.pauseAll,
    likes: req.body.notifications.pushNotifications.postAndComments.likes,
    comments: req.body.notifications.pushNotifications.postAndComments.comments,
    commentLikes:
      req.body.notifications.pushNotifications.postAndComments.commentLikes,
    follower: req.body.notifications.pushNotifications.follower.follower,
    messageRequest:
      req.body.notifications.pushNotifications.directMessages.messageRequest,
    messages: req.body.notifications.pushNotifications.directMessages.messages,
    videoChats:
      req.body.notifications.pushNotifications.directMessages.videoChats,
    feedbackEmail:
      req.body.notifications.emailAndSmsNotifications.feedbackEmail,
    reminderEmail:
      req.body.notifications.emailAndSmsNotifications.reminderEmail,
    productEmail: req.body.notifications.emailAndSmsNotifications.productEmail,
    newsEmail: req.body.notifications.emailAndSmsNotifications.newsEmail,
    theme: req.body.theme,
    phoneNumber: req.body.account.personalInfo.phoneNumber,
    gender: req.body.account.personalInfo.gender,
    birthDay: req.body.account.personalInfo.birthDay,
    language: req.body.account.language,
  };
  faunaQueries
    .setCurrentSettings(settings)
    .then((results) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      // const error = ResponseError(err, req.path);
      // return res.json(
      //   generateError({
      //     error: error.type,
      //     reasons: [
      //       {
      //         reason: error.reason,
      //         message: error.message,
      //         data: error.data,
      //         location: error.location,
      //         description: error.description,
      //       },
      //     ],
      //   })
      // );
      return res.json(err);
    });
};

router.get("/default", GetDefaultSettings);
router.get("/current", GetCurrentSettings);
router.post("/default", SetDefaultSettings);
router.post("/current", SetCurrentSettings);

export default router;
