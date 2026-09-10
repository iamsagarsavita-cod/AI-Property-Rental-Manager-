const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "Login Token is Required" });
    }

    token = token.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decodedToken) {
      req.userId = decodedToken.userId;
      req.role = decodedToken.role;
    } else {
      return res.status(401).json({ msg: "Invalid Or Expired Token" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const ownerAuth = async (req, res, next) => {
    try {
        if(req.role !== "owner"){
            return res.status(403).json({msg:"Access Denied, Only Owner Can Accesss"})
        }
    } catch (error) {
        
    }
};

module.exports = { authentication, ownerAuth };
