import jwt from "jsonwebtoken";

const isAuthenticated = (req, res,next) => {

try {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY1);
  
    if(!decode){
        return res.status(401).json({message: "Unauthorized"});
    }

    req.id = decode.id;
    next();
    
} catch (error) {
    console.log(error);
    res.status(401).json({message: "Unauthorized"});
}

};