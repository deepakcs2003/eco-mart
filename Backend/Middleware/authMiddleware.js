const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authToken = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    // console.log("tpekn",token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not provided"
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid Token"
        });
      }

      // Attach decoded token data to req.user
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role, // Attach the role from the token
      };
      next();
    });
  } catch (err) {
    console.error("Auth Error: ", err);
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports =  authToken ;