const { UserAccount, Userrole } = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("express");
const logger = require("../controllers/logger/winstonLogger");
const EmailSender = require("../controllers/email/emailSender");

const userController = {
    addUser: async (req, res) => {
        console.log(req.body);
        try {
            

            if(req.body.password != req.body.rePassword){
              return  res.render("register", {
                    mess :  " Password and repeat password did not match "
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt);

            
            const newUser = await new UserAccount({
                email: req.body.email,
                avatar: req.body.avatar,
                username: req.body.username,
                password: hashPass,
                phone: req.body.phone,
                dob: req.body.dob,

            });

            const tokenActivate = jwt.sign({
                id: newUser._id
            }, process.env.JWT_ACCESS_KEY, {
                expiresIn: "30m"
            });

            fullTokenActivate = "Bearer " + tokenActivate;

            const URL = "http://localhost:8000/api/verify/account/" + fullTokenActivate;
            console.log('URL', URL)
            const content = `Click <a href = "${URL}" > here  </a> to activate your account`;

            Iuser = await Userrole.findOne({ name: new RegExp('^' + "user" + '$', "i") });
            newUser.role = Iuser._id;
            console.log(Iuser._id);

            EmailSender(res, newUser.email, "Active Your Account", content);
            await newUser.save();
            res.status(200).json({
                newUser,
                tokenActivate
            });
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    addRole: async (req, res) => {
        try {
            const Role = await new Userrole({
                "name": req.body.name
            });
            await Role.save();
            res.status(200).json(Role);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    forgotPassword: async (req, res) => {
        try {
            const user = await UserAccount.findOne({ "email": req.body.email });
            if (!user) {
                return res.status(404).json({
                    "success": false,
                    "message": "did not found email"
                })
            } else {
                console.log("userID: " + user._id);

                const tokenActivate = jwt.sign({
                    id: user._id
                }, process.env.JWT_ACCESS_KEY, {
                    expiresIn: "30m"
                });

                fullTokenActivate = "Bearer " + tokenActivate;

                const URL = "http://localhost:8000/api/verify/reset-password/" + fullTokenActivate;
                console.log('URL', URL)
                const content = `Click <a href = "${URL}" > here  </a> to reset your password`;

                EmailSender(res, req.body.email, "Reset your password", content).then(res.status(200).json({
                    "suscces": true,
                    "message": "We have sent email to verify your account, pls check your email"
                }))
            }
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    resetPassword: async (req, res, id) => {
        try {
            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "Invalid token"
                })
            } else {

                if(!req.body.NewPassword || !req.body.reNewPassword){
                    return res.status(403).json({
                        "success": false,
                        "message": "you need to fill in require text box"
                    })
                }

                if (req.body.NewPassword == req.body.reNewPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(req.body.NewPassword, salt);
                    user.password = newPassword;
                    await user.save();
                    return res.status(403).json({
                        "success": true,
                        "message": "Reset password success"
                    })
                } else {
                    return res.status(403).json({
                        "success": false,
                        "message": "New Password and Comfirm Password does not match"
                    })
                }
            }

        } catch (err) {
            res.status(400).json(err.message);

        }
    },

    activeUserAccountByToken: async (req, res, id) => {
        try {

            const user = await UserAccount.findById(id).populate("role");

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "Invalid token"
                })
            } else {
                user.active = true;
                console.log("activate: " + user.active)
                await user.save();
                res.status(200).json({
                    "success": true,
                    "message": "Verify account success",
                    "data": user
                });
            }

        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllRole: async (req, res) => {
        try {
            const userrole = await Userrole.find();
            // Update InforUserID for user
            res.status(200).json({
                "success": true,
                "data": userrole
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any userrole" + err.message
            });
            logger.info({
                "success": false,
                "message": "did not found any userrole"
            })
        }
    },
    getAllUser: async (req, res) => {
        try {
            const users = await UserAccount.find();
            // Update InforUserID for user
            const { password, ...others } = users._doc;
            res.status(200).json({
                "success": true,
                "data": { ...others }
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any user" + + err.message
            });
            logger.info({
                "success": false,
                "message": "did not found any user" + + err.message
            })
        }
    },
    deleteUserByID: async (res, id) => {
        try {
            if (await UserAccount.findByIdAndDelete(id)) {
                res.status(200).json("DELETE USER SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
        } catch (err) {
            res.status(500).json(err.message);

        }
    },
    UpdateUserByID: async (req, res, id, authCheck) => {
        try {
            const user = await UserAccount.findById(id);
            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dob = req.body.dob;

            if (!authCheck && req.body.role) {
                return res.status(402).json({
                    "success": false,
                    "message": "permission denied"
                })
            } else {
                user.role = req.body.role;
            }
            await user.save();
            res.status(500).json({
                "success": true,
                "data": user
            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update user failed",
                "error": err.message
            });
        }
    },
    ChangeUserPassword: async (req, res, id) => {
        try {
            const user = await UserAccount.findById(id);
            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            } else {
                const checkPass = await bcrypt.compare(req.body.OldPassword, user.password);
                if (!checkPass) {
                    return res.status(400).json({
                        "success": false,
                        "message": "wrong password"
                    });
                } else {
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


        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update user failed",
                "error": err.message
            });
        }
    },
    activeOrBlockUserAccountByID: async (res, id) => {
        try {
            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "did not found user"
                })
            }

            if (!user.active) {
                user.active = true;
            } else {
                user.active = false;
            }
            user.save();
            // Update InforUserID for user
            res.status(500).json({
                "success": true,
                "data": user

            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "block or unblock user failed",
                "error": err.message
            });
        }
    }
    ,
    loginUser: async (req, res) => {
        try {
            const user = await UserAccount.findOne({ email: req.body.email }).populate("role");
            if (!user) {
                res.status(404).json({
                    "success": false,
                    "message": "username or password not match"
                });
            } else {
                const checkPass = await bcrypt.compare(req.body.password, user.password);
                if (!checkPass) {
                    res.status(404).json({
                        "success": false,
                        "message": "username or password not match"
                    });
                } else {
                    if (!user.active) {
                        res.status(402).json({
                            "success": false,
                            "message": "your account get blocked"
                        });
                    } else {

                        if (!user.role.name) {
                            return res.status(403).json({
                                "success": false,
                                "message": "userrole is Null"
                            })
                        }

                        const tokenAccess = jwt.sign({
                            id: user._id,
                            role: user.role.name
                        }, process.env.JWT_ACCESS_KEY, {
                            expiresIn: "2h"
                        });

                        const { password, username, ...others } = user._doc;
                        const fullToken = `Bearer ${tokenAccess}`


                        console.log({
                            ...others
                        })

                        res.render("userProfile",{
                            user : {...others}
                        })
                        

                    }
                }
            }

        } catch (err) {
            console.log("err ", err);
            res.status(400).json({
                "success": false,
                "message": err.message
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