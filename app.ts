import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import { handleError, validator } from "./src/middleware";
import { default as api } from "./src/routes";
import validateToken from "./src/middleware/auth";
import rateLimit from "express-rate-limit";
import { TOO_MANY_REQUESTS } from "./src/helper";
import { FAILURE } from "./src/utils/constant";

const app = express();
app.use("/", express.static("public"));
app
  .use(cors())
  .use(
    bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
      parameterLimit: 5000,
    }),
  )
  .use(bodyParser.json({ limit: "100mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    res.status(TOO_MANY_REQUESTS).json({
      status: FAILURE,
      statusCode: TOO_MANY_REQUESTS,
      message: "Too many requests, please try again later.",
    });
  },
});

app.use("/api", apiLimiter);

app.use(validateToken);
app.use(validator);
app.use("/api", api);

app.use((err, req, res, next) => {
  handleError(err, res);
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
