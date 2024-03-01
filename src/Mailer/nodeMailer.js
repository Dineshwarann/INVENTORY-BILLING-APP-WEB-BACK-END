import { createTransport } from "nodemailer";

//creating transport to send mail
export const transport=createTransport({
    service:"gmail",
    auth:{
        user:"inventoryapp25@gmail.com",
        pass:"hxwz vife mxem mrvx"
    },
})