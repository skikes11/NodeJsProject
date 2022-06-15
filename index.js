const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");

dotenv.config();    
//connect database
mongoose.connect((process.env.MONGODB_URL),()=>{
    console.log("connected database");
});



app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));  

// API
app.use("/users", userRoute);   
// app.use("/userInfor", userInforRoute);
        
app.listen(8000, ()=>{
    console.log("Server is running..");
})