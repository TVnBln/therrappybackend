import { Router } from "express";
import { createMessage } from "../../db/queries/chat";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const CreateMessage = (req, res) => {
  faunaQueries
    .createMessage(req.body.author, req.body.message, req.body.chatRoomId)
    .then((result) => {
      return res.status(200).json(result);
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
      // return res.json(err);
    });
};

const CreateChatRoom = (req, res) => {
  faunaQueries
    .createChatRoom(
      req.body.chatRoomName,
      false,
      req.body.user1,
      req.body.user2
    )
    .then((result) => {
      return res.status(200).json(result);
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
      // return res.json(err);
    });
};

const CreateChatGroup = (req, res) => {
  faunaQueries
    .createChatRoom(req.body.chatRoomName, true)
    .then((result) => {
      return res.status(200).json(result);
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
      // return res.json(err);
    });
};

const GetLatestMessages = (req, res) => {
  faunaQueries
    .getLatestMessages(req.body.afterTs, req.body.chatRoomId)
    .then((result) => {
      return res.status(200).json(result);
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
      // return res.json(err);
    });
};

router.post("/message", CreateMessage);
router.post("/room", CreateChatRoom);
router.post("/group", CreateChatGroup);
router.get("/message", GetLatestMessages);

export default router;
