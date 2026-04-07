import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.admin; 
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Token is not valid",
    });
  }
};

export default authenticate;