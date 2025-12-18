import { BAD_REQUEST } from "../helper";

interface Err {
  statusCode?: number; // make optional
  message: string;
}

const handleError = (err: Err, res) => {
  const { statusCode = BAD_REQUEST, message } = err;

  res.status(statusCode).json({
    status: "FAILURE",
    statusCode,
    message,
  });
};

export default handleError;
