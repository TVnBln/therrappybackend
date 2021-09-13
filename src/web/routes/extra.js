import { Router } from "express";
import { faunaQueries } from "../../db/query-manager";
import {
  generateError,
  safeVerifyError,
  ResponseError,
  SendMail,
} from "../../helpers";
const router = Router();

const ClearDB = (req, res) => {
  faunaQueries
    .clearDB()
    .then((res) => {
      return res.json(res);
    })
    .catch((err) => {
      return res.json(err);
    });
};

router.delete("/db", ClearDB);

export default router;
