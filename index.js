import express from "express";

const app = express();
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

app.use("/movies/get",(req,res,next) =>{
    res.status(200).send(`{status:${res.statusCode}, data: ${movies.map(e=>{return ` title: ${e.title}, year: ${e.year}, rating: ${e.rating}||`})}}`)
})

app.use("/hello/:id",(req,res,next) =>{
    let id= req.params.id;
    if(id){
        res.send(`{status:${res.statusCode}, message: Hello, ${id}}`)
    }else{
        res.send(`{status:${res.statusCode}, message: Hello}}`)

    }
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