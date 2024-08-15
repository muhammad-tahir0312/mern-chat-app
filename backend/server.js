import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import authHandler from "./Handler/authHandler.js";
import messageHandler from "./Handler/messageHandler.js";
import userHandler from "./Handler/userHandler.js";
import connectDB from "./database/databaseConnection.js";

dotenv.config();

const App = express();
const PORT = process.env.PORT || 3000;

App.use(express.json());
App.use(cors());
App.use(cookieParser());

App.use("/api/auth", authHandler);
App.use("/api/message", messageHandler);
App.use("/api/user", userHandler);

App.listen(PORT,()=>{
    connectDB();
    console.log(`App is listening on ${PORT}` .bgWhite .bgGreen);
});