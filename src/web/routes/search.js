import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

router.get("/:keyword", (req, res) => {
  faunaQueries
    .searchPeopleAndTags(req.params.keyword)
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
});

export default router;
