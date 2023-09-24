import express from "express";

import mongoose from "mongoose";

const app = express();

const moviesSchema= new mongoose.Schema({
    _id:Number,
    title:String,
    year:Number,
    rating:Number
});

const Movies=mongoose.model("movies",moviesSchema);

//Get the count of movies documents to increment it on every insert operation. 

let count=0;
app.use("",async (req,res,next)=>{
count=await Movies.count({});
next();
})

//Insert a movie to the database

app.get("/movies/add",async (req,res,next)=>{
    let title=req.query.title;
    let year=req.query.year;
    let rating=req.query.rating ?? 4;
    try {
        if (title && year && (year.toString().length >= 4) && (typeof +year ==="number") ){
        
            const movie=new Movies({
                _id:++count,
                title:title,
                year:year,
                rating:rating
            })

            await movie.save();
    
            res.redirect("/movies/get");
        }else{
        res.status(403).send({status:res.statusCode, error:true, message:'you cannot create a movie without providing a title and a year'})
        }
        
    } catch (err) {
        console.log(err);
    }
  
})
//Delete a movie from database, based on the given id.

app.get("/movies/delete/:id",async (req,res,next) =>{
    const id=req.params.id;
    try{
        
        await Movies.findByIdAndDelete(id);        
        res.redirect("/movies/get");

    }catch(err){
        console.log(err);
        res.status(404).send({status:res.statusCode, error:true, message:`the movie ${id} does not exist`})
    }
    
})

//Update a movie in database, base on the given id and new values.

app.get("/movies/update/:id",async (req,res,next) =>{
    const title=req.query.title;
    const year=req.query.year;
    const rating=req.query.rating;
    const id=req.params.id;
    const movie= await Movies.findById(id);
    if(title){
        movie.title=title;
    }
    if(year){
        movie.year=+year;
    }
    if(rating){
        movie.rating=+rating;
    }
    await movie.save();
    res.redirect("/movies/get");
})

//Fetch one movie from the database based on th given id.

app.get("/movies/get/id/:id",async (req,res,next)=>{
    let id= req.params.id;
    try{
        const movie=await Movies.findById(id);

            res.status(200).send({status: res.statusCode, data:movie})

    }catch(err){
        res.status(404).send({status: res.statusCode, error:true, message: `the movie ${id} does not exist`});
    }
   
})

//fetch and sort all movies based on the given field.

app.get("/movies/get/:sort",async (req,res,next) =>{
    let sort=req.params.sort;
    let moviesList; 
    if(sort ==="by-date"){  
        moviesList= await Movies.find().sort({year:'asc'});
    }else if(sort ==="by-rating"){
        moviesList= await Movies.find().sort({rating:"desc"});
    } else if(sort ==="by-title"){
        moviesList= await Movies.find().sort({title:'asc'});

    }
    res.status(200).send({status:res.statusCode, data:moviesList })
})

//Fetch all movies from the movies collection.

app.get("/movies/get",async (req,res,next) =>{
    try{
    const movies=await Movies.find();

    res.status(200).send({status:res.statusCode,movies:movies})
    }catch(err){
        console.log(err);
    }
})

app.get("/hello/:id",(req,res,next) =>{
    let id= req.params.id;
    if(id){
        res.send({status:res.statusCode, message: `Hello, ${id}`})
    }else{
        res.send({status:res.statusCode, message: 'Hello'})

    }
})
app.get("/search",(req,res,next)=>{
    let search=req.query.s;
    if(search){
        res.status(200).send({status:res.statusCode, message: "ok", data: `${search}`});
    }else{
        res.status(500).send({status:res.statusCode, error: true, message: "you have to provide a search"});

    }

})
app.get("/time", (req,res,next)=>{
    let date=new Date();
    let time=`${date.getHours()} : ${date.getMinutes()}`
    res.send({status:res.statusCode, message: time});
})

app.get("/test", (req,res,next)=>{
    res.send({status:res.statusCode, message:"ok"});

})

app.get("/",(req,res,next)=>{
    res.send("OK");
})



mongoose.connect("mongodb+srv://jihadabdlghani:movieDB@cluster0.bmrdvwh.mongodb.net/");
app.listen(3000,(err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Starting server on port 3000");
    }
})
