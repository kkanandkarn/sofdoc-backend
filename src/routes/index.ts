import express from "express";
import { auth } from "./auth";
import { otp } from "./otp";
const app = express();
app.disable("x-powered-by");

app.use("/auth", auth);
app.use("/otp", otp);

export default app;
