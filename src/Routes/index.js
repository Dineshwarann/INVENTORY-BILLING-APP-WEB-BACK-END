import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import addingUser, { addingProduct, deleteProduct, findUser, findingUser, forgotToken, getProduct, updatingPassword } from "../Controllers/index.js";
import { generateExpiryToken } from "../Authorization/auth.js";
import { transport } from "../Mailer/nodeMailer.js";


const router=express.Router();

router.post("/signup",async(req,res)=>{
    try {
        //finding if user already registered with the emailid
        const findUser=await findingUser(req.body.email);
        if(findUser.length>=1){
            return res.status(400).json({message:"User email already registered"});
        }else{
            //encrypting user password
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(req.body.password,salt);
            //creating object with user details
            const data={
                email:req.body.email,
                name:req.body.name,
                password:hashedPassword,
            }
            //adding user to the db
            const registeringUser=await addingUser(data);
            return res.status(200).json({message:"Signup successfull",data:registeringUser})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Registration failed"});
    }
})

//login User
router.post("/signin",async(req,res)=>{
    try {
        //checking is user email is registered 
        const checkUser=await findingUser(req.body.email);
        if(checkUser.length===0){
            return res.status(400).json({message:"Invalid email"});
        }else{ 
            //validating password with email
            const validatingPassword=await bcrypt.compare(req.body.password,checkUser[0].password);
            if(validatingPassword){
                    return res.status(200).json({message:"login success",data:checkUser})
            }else{
                return res.status(200).json({message:"Invalid Password"})
            }  
        }
}catch (error) {
        console.log(error)
        res.status(500).json({message:"Login User Failed"})
    }
})


//forgot password
router.post("/forgot",async(req,res)=>{
    try {
        //checking user email is registered or not
        const findUser=await findingUser(req.body.email);
        if(findUser.length<1){
            return res.status(400).json({message:"Invalid Email address"})
        }else{
            //creating expiry token
            const token=await generateExpiryToken(findUser[0]._id);
            //adding token to the database
            const setToken=await forgotToken(findUser[0]._id,token);
             //sending mail to reset password
             const link=`https://inventorywebapplication.netlify.app/reset/${findUser[0]._id}`
             //composing mail
             const composingMail={
                 from:"inventoryapp25@gmail.com",
                 to:findUser[0].email,
                 subject:"Password Reset Link",
                 html:`<a href=${link}><button style="background:violet;
                 color:black;
                 height:50px;
                 width:150px;
                 border:none;
                 border-radius:15px;
                 font-weight:bolder;
                 ">Click to Reset Password</button></a>`
             }
             //creating transport to send mail
             transport.sendMail(composingMail,(error,info)=>{
                 if(error){
                     console.log(error)
                 }else{
                     console.log("mail sent")
                 }
             })
             return res.status(200).json({message:"Reset Link sent to mail"});
        }
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Error forgot Password"})
    }
})
// reset password
router.post("/reset/:id",async(req,res)=>{
    try {
          //finding user
          const getUser=await findUser(req.params.id);
          //encrypting user password
          const salt=await bcrypt.genSalt(10);
          const hashedPassword=await bcrypt.hash(req.body.password,salt);
          //updating password
          const updating=await updatingPassword(getUser[0]._id,hashedPassword);
          return res.status(200).json({message:"Password Reset Successfull"});
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Reset Link Expired"})
    }
})

// add product
router.post("/addproduct",async(req,res)=>{
    try {
          const data={
            name:req.body.name,
            category:req.body.category,
            price:req.body.price,
            quantity:req.body.quantity
          }
          const addingProductToDb=await addingProduct(data);
          return res.status(200).json({data:addingProductToDb,message:"Add Product Successfull"});
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Add product failed"})
    }
})

// get product
router.get("/getproduct",async(req,res)=>{
    try {
          const gettingProductFromDB=await getProduct();
          return res.status(200).json({data:gettingProductFromDB,message:"Get Product Successfull"});
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Get product failed"})
    }
})

// delete product
router.post("/deleteproduct",async(req,res)=>{
    try {
          const deleteproductfromdb=await deleteProduct(req.body.id);
          return res.status(200).json({message:"Delete Product Successfull"});
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Get product failed"})
    }
})
export const Router=router;