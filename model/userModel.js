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
            type: mongoose.Schema.Types.ObjectId,
            ref : 'UserRole',
            default : null
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

const userRoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


let UserAccount = mongoose.model("UserAccount", userAccountSchema);
let UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = {UserAccount, UserRole};