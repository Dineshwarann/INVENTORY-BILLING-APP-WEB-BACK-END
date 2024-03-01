import mongoose from "mongoose";

export function connectDB(){
    try{
        mongoose.connect(process.env.connectionString);
        console.log("database connected")
    }catch{
        console.log("error connecting to the database");
    }
}