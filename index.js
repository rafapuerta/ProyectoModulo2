const express = require("express")
const mongodb = require("mongodb")
const app = express()
const bcrypt = require("bcrypt")

let MongoClient = mongodb.MongoClient;

let user = require("./user")

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use("/user", user)

MongoClient.connect("mongodb://127.0.0.1:27017", function( error, client){
    if (error !== null) {
        console.log(error);
      } else {
        app.locals.db = client.db("festival");
      }
})


app.listen(3000)