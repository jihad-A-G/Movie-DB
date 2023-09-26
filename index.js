/* 
$$\   $$\           $$\ $$\                 $$$$$$$$\                                                                    
$$ |  $$ |          $$ |$$ |                $$  _____|                                                                   
$$ |  $$ | $$$$$$\  $$ |$$ | $$$$$$\        $$ |  $$\    $$\  $$$$$$\   $$$$$$\  $$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$\  
$$$$$$$$ |$$  __$$\ $$ |$$ |$$  __$$\       $$$$$\\$$\  $$  |$$  __$$\ $$  __$$\ $$ |  $$ |$$  __$$\ $$  __$$\ $$  __$$\ 
$$  __$$ |$$$$$$$$ |$$ |$$ |$$ /  $$ |      $$  __|\$$\$$  / $$$$$$$$ |$$ |  \__|$$ |  $$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |
$$ |  $$ |$$   ____|$$ |$$ |$$ |  $$ |      $$ |    \$$$  /  $$   ____|$$ |      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$   ____|
$$ |  $$ |\$$$$$$$\ $$ |$$ |\$$$$$$  |      $$$$$$$$\\$  /   \$$$$$$$\ $$ |      \$$$$$$$ |\$$$$$$  |$$ |  $$ |\$$$$$$$\ 
\__|  \__| \_______|\__|\__| \______/       \________|\_/     \_______|\__|       \____$$ | \______/ \__|  \__| \_______|
                                                                                 $$\   $$ |                              
                                                                                 \$$$$$$  |                              
                                                                                  \______/             

Our movies app let authenticated users navigate through movies, add, update, and delete them.

*/
import express from "express";

import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
$$\      $$\                     $$\                     
$$$\    $$$ |                    \__|                    
$$$$\  $$$$ | $$$$$$\ $$\    $$\ $$\  $$$$$$\   $$$$$$$\ 
$$\$$\$$ $$ |$$  __$$\\$$\  $$  |$$ |$$  __$$\ $$  _____|
$$ \$$$  $$ |$$ /  $$ |\$$\$$  / $$ |$$$$$$$$ |\$$$$$$\  
$$ |\$  /$$ |$$ |  $$ | \$$$  /  $$ |$$   ____| \____$$\ 
$$ | \_/ $$ |\$$$$$$  |  \$  /   $$ |\$$$$$$$\ $$$$$$$  |
\__|     \__| \______/    \_/    \__| \_______|\_______/ 
*/                                                       
                                                         
                                                                                                                                 
const moviesSchema= new mongoose.Schema({
    _id:Number,
    title:String,
    year:Number,
    rating:Number
});

const Movies=mongoose.model("movies",moviesSchema);



//Get the count of movies documents to increment the id on every insert operation. 

let count=0;
app.use("",async (req,res,next)=>{
count=await Movies.count({});
next();
});

//Insert a movie to the database

app.post("/movies/add/",async (req,res,next)=>{
    const {title, year,rating=4} = req.body;
    const {username="",password}=req.query;
    try {
        if( await checkUser(username,password)===false){
           return res.status(404).json({status:res.statusCode, error:true, message:"user doesn't exist, try to sign up"});
        }

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
        res.status(403).json({status:res.statusCode, error:true, message:'you cannot create a movie without providing a title and a year'})
        }
        
    } catch (err) {
        console.log(err);
    }
  
});
//Delete a movie from database, based on the given id.

app.delete("/movies/delete",async (req,res,next) =>{
    const {id, username,password}=req.query;
    console.log(username);

    try{
        if( await checkUser(username,password)===false){
            return res.status(404).json({status:res.statusCode, error:true, message:"user doesn't exist, try to sign up"});
        }
        
        await Movies.findByIdAndDelete(id);        
        res.redirect("/movies/get");

    }catch(err){
        console.log(err);
        res.status(404).json({status:res.statusCode, error:true, message:`the movie ${id} does not exist`})
    }
    
});

//Update a movie in database, base on the given id and new values.

app.put("/movies/update/",async (req,res,next) =>{
    const {title,year,rating} =req.body;
    const {id, username,password}=req.query;
    try{
        if( await checkUser(username,password)===false){
           return res.status(404).json({status:res.statusCode, error:true, message:"user doesn't exist, try to sign up"});
        }
        
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
}catch(err){
    console.log(err);
}
});

//Fetch one movie from the database based on th given id.

app.get("/movies/get/id/:id",async (req,res,next)=>{
    let id= req.params.id;
    try{
        if(id>count || id<0){
            error();
        }
        const movie=await Movies.findById(id);

            res.status(200).json({status: res.statusCode, data:movie})

    }catch(err){
        res.status(404).json({status: res.statusCode, error:true, message: `the movie ${id} does not exist`});
    }
   
});

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
    res.status(200).json({status:res.statusCode, data:moviesList })
});

//Fetch all movies from the movies collection.

app.get("/movies/get",async (req,res,next) =>{
    try{
    const movies=await Movies.find();

    res.status(200).json({status:res.statusCode,movies:movies})
    }catch(err){
        console.log(err);
    }
});

/*
$$\   $$\                                         
$$ |  $$ |                                        
$$ |  $$ | $$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  _____|$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |\$$$$$$\  $$$$$$$$ |$$ |  \__|\$$$$$$\  
$$ |  $$ | \____$$\ $$   ____|$$ |       \____$$\ 
\$$$$$$  |$$$$$$$  |\$$$$$$$\ $$ |      $$$$$$$  |
 \______/ \_______/  \_______|\__|      \_______/ 
                                                                                            
 */

const userSchema= new mongoose.Schema({
    username:String,
    password:Number
})

const User= mongoose.model("users",userSchema);

const checkUser= async (username="",password)=>{
    const user=await User.findOne({username:username,password:password});
        if(!user){
            return false;
        }
        return true
}
//get all users from the database
app.get("/user/get", async(req,res,next)=>{
try{
    const users= await User.find({});
    res.status(200).json({status:res.statusCode, users:users});
}catch(err){
    console.log(err);
}
});
// add a new user to the database.
app.post("/user/add",async(req,res,next)=>{
    const {username,password}=req.body;
    try{
        const checkForUser=await User.findOne({username:username});
        if(checkForUser){
           return res.status(403).json({status:res.statusCode, error:true, message:"user already exists"});
        }
        const user= new User({
            username:username,
            password:password
        });
       await user.save();
        res.redirect("/user/get");
    }catch(err){
        console.log(err);
    }
});
// update an existing user in the database based on given values.
app.put("/user/update/:username",async (req,res,next)=>{
    const {username, password}=req.body;
    const {username:usernameparam}=req.params;
    try{
        const user=await User.findOne({username:usernameparam});
        if(!user){
           return res.status(404).json({status:res.statusCode, error:true, message:"user doesn't exist"});
            
        }
        user.username=username;
        user.password=password;
       await  user.save();
        res.redirect("/user/get");
    }catch(err){
        console.log(err);
    }
});
//delete a user from the database based on the id.
app.delete("/user/delete/:username", async(req,res,next)=>{

    const {username}=req.params;
    try{
       await User.findOneAndDelete({username:username});

        res.redirect("/user/get");
    }catch(err){
        res.status(404).json({status:res.statusCode, error:true, message:"User doesn't exists"});
    }

})

/*
$$$$$$$$\                              
$$  _____|                             
$$ |      $$$$$$\   $$$$$$$\ $$\   $$\ 
$$$$$\    \____$$\ $$  _____|$$ |  $$ |
$$  __|   $$$$$$$ |\$$$$$$\  $$ |  $$ |
$$ |     $$  __$$ | \____$$\ $$ |  $$ |
$$$$$$$$\\$$$$$$$ |$$$$$$$  |\$$$$$$$ |
\________|\_______|\_______/  \____$$ |
                             $$\   $$ |
                             \$$$$$$  |
                              \______/ 
*/

app.get("/hello/:id",(req,res,next) =>{
    let id= req.params.id;
    if(id){
        res.send({status:res.statusCode, message: `Hello, ${id}`})
    }else{
        res.send({status:res.statusCode, message: 'Hello'})

    }
});
app.get("/search",(req,res,next)=>{
    let search=req.query.s;
    if(search){
        res.status(200).send({status:res.statusCode, message: "ok", data: `${search}`});
    }else{
        res.status(500).send({status:res.statusCode, error: true, message: "you have to provide a search"});

    }
});
app.get("/time", (req,res,next)=>{
    let date=new Date();
    let time=`${date.getHours()} : ${date.getMinutes()}`
    res.send({status:res.statusCode, message: time});
});

app.get("/test", (req,res,next)=>{
    res.send({status:res.statusCode, message:"ok"});

});

app.get("/",(req,res,next)=>{
    res.send("OK");
});



mongoose.connect("mongodb+srv://jihadabdlghani:movieDB@cluster0.bmrdvwh.mongodb.net/");

app.listen(3000,(err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Starting server on port 3000");
    }
});
