import express from "express";
import { auth } from "./auth";
const app = express();
app.disable("x-powered-by");

app.use("/auth", auth);

export default app;
