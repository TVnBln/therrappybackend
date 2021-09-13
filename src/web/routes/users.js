import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import { uploadStrategy } from "../../helpers/azure";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const getUser = (req, res) => {
  faunaQueries;
};

const updateUser = (req, res) => {
  faunaQueries
    .updateUser(req.body.fullname, req.body.username, req.body.bio)
    .then((result) => {
      return res.status(200).json(result);
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

const UploadMediaFile = (req, res) => {
  faunaQueries
    .uploadProfileImage(req)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
};

const GetProfile = (req, res) => {
  faunaQueries
    .getProfile()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
};

const GetRatings = (req, res) => {
  faunaQueries
    .getRatings()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
};

const DeleteUserAndAccount = (req, res) => {
  faunaQueries
    .deleteUserAndAccount()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
};

router.post("/updateUser", updateUser);
router.post("/uploadProfileImage", uploadStrategy, UploadMediaFile);
router.get("/profile", GetProfile);
router.get("/ratings", GetRatings);
router.delete("/", DeleteUserAndAccount);

export default router;
