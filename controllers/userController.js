const { hashSync } = require("bcryptjs");
const {UserAccount, UserRole} = require("../model/userModel");
const bcrypt = require('bcrypt');
const { boolean } = require("joi");
const jwt = require("jsonwebtoken");
const e = require("express");


const userController = {
    addUser: async(req,res)=>{
        try{
             const salt = await bcrypt.genSalt(10);
             const hashPass = await bcrypt.hash(req.body.password, salt);
             console.log(hashPass);
             const newUser = await new UserAccount({
                name : req.body.name,
                username : req.body.username,
                password : hashPass,
                phone : req.body.phone,
                dob : req.body.dob,
                email : req.body.email
             });
             
             if(!newUser.role){
             console.log(newUser);      
             Iuser = await UserRole.findOne({name : new RegExp('^'+"user"+'$', "i") });
             newUser.role = Iuser._id;
             console.log(Iuser._id);      
             }
             await newUser.save();   
            res.status(200).json(newUser);
        }catch(err){
           res.status(400).json(err);
        }
   },
   addRole: async(req,res)=>{
    try{
        const Role = await new UserRole({
            "name" : req.body.name
        });
        await Role.save();   
        res.status(200).json(Role);
    }catch(err){
       res.status(400).json(err);
    }
    },
    getAllRole : async(req,res)=>{
        try{
            const userRole = await UserRole.find();           
            // Update InforUserID for user
            res.status(200).json({
                "success" : true,
                "data": userRole
            });               
        }catch(err){
           res.status(500).json({
                "success" : false,
                "message" : "did not found any userRole"
           });
        }
    },
    getAllUser : async(req,res)=>{
        try{
            const users = await UserAccount.find();           
            // Update InforUserID for user
            const {password, ...others} = users._doc;
            res.status(200).json({
                "success" : true,
                "data": {...others}
            });               
        }catch(err){
           res.status(500).json({
                "success" : false,
                "message" : "did not found any user"
           });
        }
    },
    deleteUserByID : async(res,id)=>{
        try{
            if( await UserAccount.findByIdAndDelete(id)){             
            res.status(200).json("DELETE USER SUSCESS");
            }else{
                res.status(200).json({
                    "success" : false,
                    "message" : "did not found user"
                });
            }
        }catch(err){
           res.status(500).json(err);
        }
    },
    UpdateUserByID : async(req,res,id,authCheck)=>{
        try{
            const user = await UserAccount.findById(id);
            if(!user){
              return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dob = req.body.dob;

            if(!authCheck&&req.body.role){
                return res.status(402).json({
                    "success" : false,
                    "message" : "permission denied"
                })
            }else{
                user.role = req.body.role;
            }
            user.save();  
            res.status(500).json({
                "success": true,
                "data": user
            });
        }catch(err){
           res.status(404).json({
            "success": false,
            "message": "update user failed",
            "error" : err
        });
        }
    },
    ChangeUserPassword : async(req,res,id)=>{
        try{
            const user = await UserAccount.findById(id);
            if(!user){
              return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }else{
                const checkPass = await bcrypt.compare(req.body.OldPassword, user.password);
                if(!checkPass){
                    return res.status(400).json({
                        "success": false,
                        "message": "wrong password"
                    });
                }else{
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(req.body.newPassword, salt);
                    user.password = newPassword;
                    user.save();
                    res.status(500).json({
                        "success": true,
                        "data": user
                    });
                }
            }
           
            
        }catch(err){
           res.status(404).json({
            "success": false,
            "message": "update user failed",
            "error" : err
        });
        }
    },
    BlockORUnblockUserbyID : async(res,id)=>{
        try{
            const user = await UserAccount.findById(id);

            if(!user){
                return res.status(403).json({
                    "success": false,
                    "message" : "did not found user"
                })
            }

            if(!user.active){
                user.active = true;
            }else{
                user.active = false;
            }
            user.save();  
            // Update InforUserID for user
            res.status(500).json({
                "success": true,
                "data": user
                
            });
        }catch(err){
           res.status(404).json({
            "success": false,
            "message": "block or unblock user failed",
            "error" : err
        });
        }
    }
    ,
    loginUser : async(req,res) =>{
        try{
            const user = await UserAccount.findOne({username: req.body.username}).populate("role");
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
                        if(!user.active){
                            res.status(402).json({
                                "success" : false, 
                                "message" : "your account get blocked"
                            });
                        }else{

                        if(!user.role.name){
                            return res.status(403).json({
                                "success" : false,
                                "message" : "userRole is Null"
                            })
                        }

                         const tokenAccess = jwt.sign({
                            id: user._id,
                            role: user.role.name
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
            }   

        }catch(err){
                console.log("err ", err);
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