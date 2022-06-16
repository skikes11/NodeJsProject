const { hashSync } = require("bcryptjs");
const {UserAccount} = require("../model/userModel");
const registerValidation = require("./validation");
const bcrypt = require('bcrypt');
const { boolean } = require("joi");
const jwt = require("jsonwebtoken");


const userController = {
    // Add User
    addUser: async(req,res)=>{
      //  const error  = registerValidation(req.body);
       // if(error){
      //   return res.status(400).send(error);
     //   }else{
        try{
            // const {username, password, name, dob, email, phone} = req.body;
             const salt = await bcrypt.genSalt(10);
             const hashPass = await bcrypt.hash(req.body.password, salt);
             console.log(hashPass);
            const newUser = await new UserAccount(req.body);
             newUser.password = hashPass;
             await newUser.save();   
            res.status(200).json(newUser);
        }catch(err){
           res.status(500).json(err);
        }
  //  }
/*
  {
    username: username,
    password: password,
    name: name,
    profile: {
        dob: dob,
        email : email,
        phone : phone
    }
 }
*/
    },
    getAllUser : async(req,res)=>{
        try{
            const users = await UserAccount.find();           
            // Update InforUserID for user
            res.status(200).json(users);               
        }catch(err){
           res.status(500).json(err);
        }
    },
    deleteUserByID : async(req,res)=>{
        try{
            await UserAccount.findByIdAndDelete(req.params.id);           
            // Update InforUserID for user
            res.status(500).json("DELETE USER SUSCESS");
        }catch(err){
           res.status(500).json(err);
        }
    },
    loginUser : async(req,res) =>{
        try{
            const user = await UserAccount.findOne({username: req.body.username});
            if(!user){
                res.status(404).json({
                    "success" : false, 
                    "message" : "username or password not match"
                });
            }else{
                const checkPass = await bcrypt.compare(req.body.password, user.password);
                    if(!checkPass){
                        res.status(404).json({
                            "success" : false, 
                            "message" : "username or password not match"
                        });
                    }else{
                         const tokenAccess = jwt.sign({
                            id: user._id,
                            role: user.role
                         }, process.env.JWT_ACCESS_KEY,{        
                            expiresIn: "2h"
                         });   

                        const {password,username, ...others} = user._doc;
                        const fullToken = `Bearer ${tokenAccess}`
                        res.status(200).json({
                            "success" : true,
                            "data" : {
                            ...others,
                            fullToken
                            }
                        });
                    }    
            }   

        }catch(err){
                console.log("'err'");
                res.status(400).json({
                    "success" : false,
                    "message" : err
                }); 
                 
        }
    }
};


// http code
module.exports = userController;

// {
//     "success" : true/false
//     "data" : { // if true
//     }
//     "message" : "" //if false
// }