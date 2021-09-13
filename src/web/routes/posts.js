import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
import { mediaStrategy, multer } from "../../helpers/azure";
const router = Router();
const upload = multer();

const createPost = (req, res) => {
  faunaQueries
    .createPost(req.body.message, req)
    .then((postArray) => {
      return res.status(200).json({ posts: postArray });
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

const getPosts = (req, res) => {
  faunaQueries
    .getPosts()
    .then((result) => {
      return res.status(200).json({ results: result.data });
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

const getPostsByTag = (req, res) => {
  faunaQueries
    .getPostsByTag(req.params.tag)
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

const getPostsByAuthor = (req, res) => {
  faunaQueries
    .getPostsByAuthor(req.params.author)
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

const ratePost = (req, res) => {
  faunaQueries
    .ratePost(req.body.postid, req.body.rating)
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

const removeRating = (req, res) => {
  faunaQueries
    .removeRating(req.body.postid)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

const comment = (req, res) => {
  faunaQueries
    .comment(req.body.postid, req.body.message)
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

router.post("/createPost", mediaStrategy, createPost);
router.get("/getPosts", getPosts);
router.get("/getPostsByTag/:tag", getPostsByTag);
router.get("/getPostsByAuthor/:author", getPostsByAuthor);
router.post("/ratePost", ratePost);
router.post("/comment", upload.any(), comment);
router.delete("/ratePost", removeRating);

export default router;
