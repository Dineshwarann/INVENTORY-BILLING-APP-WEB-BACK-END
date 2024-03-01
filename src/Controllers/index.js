import { ObjectId } from "bson";
import { User } from "../Model/user.js";
import { Datas } from "../Model/data.js";
//registration
export default function addingUser(data){
    return User.insertMany(data);
}
//finding user using email
export function findingUser(email){
    return User.find({email});
}
//add token to db for forgot password
export function forgotToken(id,token){
    return User.findByIdAndUpdate({_id:new ObjectId(id)},{$set:{token}})
}
//finding user using email
export function findUser(id){
    return User.find({_id:new ObjectId(id)});
}
//empty token value after resetting password
export function updatingPassword(id,password){
    return User.findByIdAndUpdate({_id:new ObjectId(id)},{$set:{password,token:""}});
}
//adding product
export function addingProduct(data){
    return Datas.insertMany(data);
}
//get product
export function getProduct(){
    return Datas.find();
} 
//delete product
export function deleteProduct(id){
    return Datas.findByIdAndDelete({_id:new ObjectId(id)})
} 