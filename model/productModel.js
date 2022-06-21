const mongoose = require("mongoose");

const  ProductSchema= new mongoose.Schema({
        name: {
            type: String,
            require:true
        },
        price: {
            type: Number,
        },
        image:{
            type: String,
        }
        ,
        ProductDetail: {
            brand : {
                type: String
            },
            origin:{
                type: String
            },  
            description : {
                type : String
            }
        },
});

let Product = mongoose.model("Product", ProductSchema);

module.exports = {Product};