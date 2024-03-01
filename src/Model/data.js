import mongoose from "mongoose";

const dataSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    category:{
        type:String,
    },
    price:{
        type:Number,
    },
    quantity:{
        type:Number
    }
})

const Datas=mongoose.model("Data",dataSchema);
export {Datas};