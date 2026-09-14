const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "Login Token is Required" });
    }

    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ msg: "Invalid or Expired Token" });
      }
      req.userId = decodedToken.userId;
      req.role = decodedToken.role;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const authorization = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({ msg: "Access Denied" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  };
};

module.exports = { authentication, authorization };
