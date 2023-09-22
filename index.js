import express from "express";

const app = express();

app.use("/time", (req,res,next)=>{
    let date=new Date();
    let time=`${date.getHours()} : ${date.getMinutes()}`
    res.send(`{status:${res.statusCode}, message: ${time}}`);
})

app.use("/test", (req,res,next)=>{
    res.send(`{status:${res.statusCode}, message:"ok"}`);
    console.log(res);

})

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