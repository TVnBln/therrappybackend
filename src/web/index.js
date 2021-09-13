require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import responseTime from "response-time";
const app = express();
import routes from "./routes";

import { generateError } from "../helpers";

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseTime());

Object.keys(routes).forEach((key) => {
  app.use(`/${key}`, routes[key]);
});

app.use((req, res) => {
  return res.status(404).json(
    generateError({
      error: "Not Found",
      reasons: [
        {
          reason: "invalid_path",
          message: "The requested path could not be found",
          data: req.path,
          location: req.path,
        },
      ],
    })
  );
});

const server = app.listen(3000, () =>
  console.log(`Express server listening on PORT: ${server.address().port}`)
);
