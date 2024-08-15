import jwt from "jsonwebtoken";
import User from '../Models/auth.model.js';

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({msg:'No token, authorization denied'});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({msg:'Experired token, authorization denied'});
        }
        const user = await User.findById(decoded.userId).select("password");
        if(!user){
            return res.status(401).json({msg:'User not found, authorization denied'});
        }
        req.userId = user;
        next();
    } catch (error) {
        console.log("Theres and error in middleware", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}