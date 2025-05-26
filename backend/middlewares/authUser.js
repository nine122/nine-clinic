import jwt from "jsonwebtoken";

// user auth middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Please login first" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body = { ...req.body, userId: token_decode.id };
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
