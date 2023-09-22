import express from "express";

const app = express();
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

app.get("/movies/add",(req,res,next)=>{
    let title=req.query.title;
    let year=req.query.year;
    let rating=req.query.rating ?? 4;

    if( title && year && (year.toString().length >= 4) && (typeof +year ==="number") ){
        movies.push({title:title, year:+year, rating:+rating});
        res.redirect("/movies/get");
    }else{
        res.status(403).send({status:res.statusCode, error:true, message:'you cannot create a movie without providing a title and a year'})

    }
})
app.get("/movies/delete/:id",(req,res,next) =>{
    const id=req.params.id;
    if(+id <=movies.length){
        movies.splice(+id-1,1);
        res.redirect("/movies/get");
    }else{
        res.status(404).send({status:res.statusCode, error:true, message:`the movie ${id} does not exist`})
    }
})
app.get("/movies/update/:id",(req,res,next) =>{
    const title=req.query.title;
    const year=req.query.year;
    const rating=req.query.rating;
    const id=req.params.id;
    if(title){
        movies[+id-1].title=title;
    }
    if(year){
        movies[+id-1].year=+year;
    }
    if(rating){
        movies[+id-1].rating=+rating;
    }
    res.redirect("/movies/get");
})
app.get("/movies/get/id/:id", (req,res,next)=>{
    let id= req.params.id;
    if(id && id<=movies.length){
        res.status(200).send({status: res.statusCode, data:movies.at(+id-1)})
    }else{
        res.status(404).send({status: res.statusCode, error:true, message: `the movie ${id} does not exist`});
        console.log(res);
    }
})
app.get("/movies/get/:sort", (req,res,next) =>{
    let sort=req.params.sort;
    let moviesList=[];
    if(sort ==="by-date"){
        moviesList=movies
        .sort((a,b)=>{return a.year-b.year});
    }else if(sort ==="by-rating"){
        moviesList=movies
        .sort((a,b)=>{return b.rating-a.rating})
    } else if(sort ==="by-title"){
        moviesList=movies
        .sort((a,b)=>{
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        })

    }

    res.status(200).send({status:res.statusCode, data:moviesList })
})


app.get("/movies/get",(req,res,next) =>{

    res.status(200).send({status:res.statusCode,movies:movies})
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





app.listen(3000,(err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Starting server on port 3000");
    }
})