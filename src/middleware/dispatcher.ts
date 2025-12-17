import { OK } from "../helper";
import { SUCCESS } from "../utils/constant";
import { camelize } from "../utils/helper";
import { Dispatcher } from "../utils/interface";

const dispatcher = async ({
  req,
  res,
  next,
  func,
  resource,
  perm,
  stopPaths = [],
}: Dispatcher) => {
  try {
    const { user } = req;

    const data = await func(req, res, next);

    if (data) {
      return res.status(200).json({
        status: "SUCCESS",
        statusCode: 200,
        data,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default dispatcher;
