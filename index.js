const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const myRouter = require("./routes");

dotenv.config();    
//connect database
mongoose.connect((process.env.MONGODB_URL),()=>{
    console.log("connected database");
});



//Static files
app.use(express.static(__dirname + '/public'));

// cau hinh engine ejs
app.set("view engine", "ejs");
app.set("views","./view");



app.use('/static', express.static('public'))
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));  

// API
app.use("/api", myRouter);   
// app.use("/userInfor", userInforRoute);
        
app.listen(8000, ()=>{
    console.log("Server is running..");
})