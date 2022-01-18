// const express = require("express");//"type":"commonjs"
//const {MongoClient}=require("mongodb");// require old import 
import dotenv from "dotenv";
import express from "express";
import {MongoClient} from "mongodb"; //"type" :"module"
//PUT ALL THE KEYS FROM .ENV FILE TO PROCESS.ENV
dotenv.config();
//console.log(process.env);
const app = express();
//const port = 9000;
const port=process.env.PORT;


//const MONGO_URL="mongodb://localhost";//if port is defalut
const MONGO_URL="mongodb://localhost";

async function createConnection(){
const client=new MongoClient(MONGO_URL);
await client.connect();
console.log("DB Connected");
return client;
}

const client=await createConnection();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});


  app.get('/movies', async(req, res) => {
    if(req.query.rating){
      req.query.rating=+req.query.rating;
    }
    let filtermovie=await client.db("test").collection("movies").find(req.query).toArray();
    res.send(filtermovie);
});

app.post('/movies', async(req, res) => {
  const newMovie=req.body;
  console.log(newMovie);
  let result=await client.db("test").collection("movies").insertMany(newMovie);
  res.send(result);
});


  app.get('/movies/:id', async (req, res) => {
      const{id}=req.params;
      //const movie=movies.find((mv)=>mv.id===id);
      //db.movies.findOne({id:"102"})
      const movie=await client.db("test").collection("movies").findOne({id:id});
      movie?res.send(movie):res.status(404).send({message:"No movies found"});
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})