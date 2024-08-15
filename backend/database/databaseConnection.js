import mongoose from "mongoose";
import color from "colors";

const connectDB = async ()=>{
    const con = await mongoose.connect(process.env.MONGODB_URI)
    if(con){        
        console.log("Database Connected" .bgBlue .white);
    }
}

export default connectDB;