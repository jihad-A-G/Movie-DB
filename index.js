import express from "express";

const app = express();

app.use("/",(req,res,next)=>{
    res.send("OK");
})

app.listen(3000,(err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Starting server on port 3000");
    }
})