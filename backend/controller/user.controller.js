import User from "../Models/auth.model.js"

export const getUsers = async (req, res)=>{
    try {
        const currentUser = req.userId._id;
    
        const filteredUser = await User.find({
            _id : {$ne: [currentUser]}
        }).select("-password");

        res.status(201).json(filteredUser);
    } catch (error) {
        console.log("Theres an error in getting users", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}