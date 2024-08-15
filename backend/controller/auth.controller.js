import User from "../Models/auth.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }
        const checkUser = await User.findOne({ fullname });
        if (checkUser) {
            res.status(400).json({ message: "User alredy exists" })
        }

        //hash pass here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //profile pic
        const profilePic = `https://ui-avatars.com/api/?name=${fullname}`;

        const user = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePic
        });

        const created = await user.save();

        if (!created) {
            res.status(400).json({ message: "User not created", error: error });
        }

        //JWT middleware
        generateTokenAndSetCookie(created._id, res);

        res.status(201).json({
            name: created.fullname,
            username: created.username,
            profilePic: profilePic
        });
    } catch (error) {
        console.log("Theres and error while sigining up", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const { fullname, password } = req.body;

        const user = await User.findOne({ fullname });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password or Username" });
        }

        //JWT middleware
        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            id: user._id,
            fullname: user.fullname,
            username: user.username, 
            gender: user.gender, 
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Theres and error while logging", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{
            maxAge:0
        });
        res.status(201).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Theres and error while logging out", error);
        res.status(500).json({ error: "Internal server error"});
    }
}