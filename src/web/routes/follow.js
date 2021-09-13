import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const Follow = (req, res) => {
  faunaQueries
    .follow(req.body.authorid)
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

const Unfollow = (req, res) => {
  faunaQueries
    .unfollow(req.body.authorid)
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

const GetFollowers = (req, res) => {
  faunaQueries
    .getFollowers(req.params.userid)
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

const GetFollowing = (req, res) => {
  faunaQueries
    .getFollowings(req.params.userid)
    .then((result) => {
      return res.status(200).json(result);
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

router.get("/followers/:userid", GetFollowers);
router.get("/following/:userid", GetFollowing);
router.post("/follow", Follow);
router.post("/unfollow", Unfollow);

export default router;
