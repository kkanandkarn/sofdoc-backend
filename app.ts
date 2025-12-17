import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import { handleError } from "./src/middleware";
import { default as api } from "./src/routes";

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

app.use("/api", api);

app.use((err, req, res, next) => {
  handleError(err, res);
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
