import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Router } from "./src/Routes/index.js";

dotenv.config();

const PORT=process.env.PORT;

const app=express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/",Router);

app.listen(PORT,()=>console.log("Server started in PORT: "+PORT));