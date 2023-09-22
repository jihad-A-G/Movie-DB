import express from "express";

const app = express();

app.use("/hello/:id",(req,res,next) =>{
    let id= req.params.id;
    res.send(`{status:${res.statusCode}, message: Hello, ${id}}`)
})
app.use("/search",(req,res,next)=>{
    let search=req.query.s;
    if(search){
        res.status(200).send(`{status:${res.statusCode}, message: "ok", data: ${search}}`);
    }else{
        res.status(500).send(`{status:${res.statusCode}, error: true, message: "you have to provide a search"}`);

    }

})
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