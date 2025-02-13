import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      console.log("Token not found");
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY1);
    console.log("Decoded token:", decode);

    if (!decode || !decode.userId) {
      console.log("Token is invalid or missing user ID");
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.id = decode.userId;
    console.log("Authenticated user ID:", req.id);
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized", success: false });
  }
};

export default isAuthenticated;
