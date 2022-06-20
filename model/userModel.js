const { defaults } = require("joi");
const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema({
        username: {
            type: String,
            require:true
        },
        name: {
            type: String,
            require:true
        },
        password: {
            type: String,
            require:true
        },
        role: {
            type: String,
            default: "user"
        },
        active :{
            type : Boolean,
            default: true     
        },
        profile: {
            dob: {
                type: Date,
              //  default : "null"
            },
            phone: {
                type: String,
         //       default : "null"
            },
            email:{
                type: String,
            //    default : "null"
            }
        }
});


let UserAccount = mongoose.model("UserAccount", userAccountSchema);


module.exports = {UserAccount};