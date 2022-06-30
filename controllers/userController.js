const { UserAccount, Userrole } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const logger = require("../controllers/logger/winstonLogger");
const EmailSender = require("../controllers/email/emailSender");
const middlewareController = require("./middlewareController");
const fs = require('fs');
const { Console } = require("console");
const { uploadAvatar } = require("./helpers");
const { boolean } = require("joi");





function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)/g);
    return (res !== null)
};

function validateURL(link) {
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        return true;
    }
    else {
        return false;
    }
}

<<<<<<< HEAD

function checkExistedEmail(req){
   
      
            
}

=======
>>>>>>> be9feb5 (upgrade login with facebook)
function checkPass(req){
    if (req.body.password != req.body.rePassword) {
        return false;
    }
    return true;
}


// The link has http or https.

const userController = {
    addUser: async (req, res) => {

        try {

            uploadAvatar(req, res, async(err) => {
                const user = await UserAccount.findOne({ email: req.body.email });
                console.log( req.body)
                console.log("####check Pass : "+checkPass(req))

                if (err) {
                    return res.status(404).json({
                        "message": "can not upload file image"
                    })
                }else if(user){
                    return res.render("register", {
                        mess : "email already in use"
                    })
                }else if(!checkPass(req)){
                    return res.render("register", {
                        mess : "password did not match"
                    })
                }else {
 
                    const salt = await bcrypt.genSalt(10);
                    const hashPass = await bcrypt.hash(req.body.password, salt);


                    const newUser = await new UserAccount({
                        email: req.body.email,
                        name: req.body.name,
                        password: hashPass,
                        phone: req.body.phone,
                        dob: req.body.dob,

                    });

                    if (req.file) {
                        newUser.avatar = `/static/images/avatar/${req.file.filename}`
                    } else {
                        if (isImage(req.body.url)) {
                            newUser.avatar = req.body.url
                        }
                    }

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
                    console.log(newUser);

                    EmailSender(res, newUser.email, "Active Your Account", content);
                    await newUser.save();
                    // res.status(200).json({
                    //     newUser,
                    //     tokenActivate
                    // });
                    res.render("registrationComplete");
                }
            })



            

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
                return res.render("forgotPassword", {
                    mess: "Invalid Email"
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

                await EmailSender(res, req.body.email, "Reset your password", content);
                res.render("forgotPasswordV1");

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

                if (!req.body.NewPassword || !req.body.reNewPassword) {
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
                    res.render("resetPasswordCompleted");
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
                // res.status(200).json({
                //     "success": true,
                //     "message": "Verify account success",
                //     "data": user
                // });

                res.render("verifyAccountCompleted");

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
    UpdateUserByID: async (req, res, id) => {
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
    UpdateUserByToken: async (req, res, id) => {
        try {

            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user.name = req.body.name;
            user.phone = req.body.phone;
            user.dob = req.body.dob;


            if(!user.avatar){
                user.avatar = "default"
            }

<<<<<<< HEAD
=======
            if(!user.avatar){
                user.avatar = "default"
            }

>>>>>>> be9feb5 (upgrade login with facebook)
            if (req.file) {
                if (!validateURL(user.avatar)&& user.avatar != "default") {
                    var oldPath = "." + user.avatar;
                    var getPath = oldPath.replace('static', 'public')
                    await fs.unlinkSync(getPath);
                    console.log("unlink path" + getPath);
                }
                user.avatar = `/static/images/avatar/${req.file.filename}`
            } else {
                if (isImage(req.body.url)) {

                    if (!validateURL(user.avatar) && user.avatar != "default" ) {
                        var oldPath = "." + user.avatar;
                        var getPath = oldPath.replace('static', 'public')
                        await fs.unlinkSync(getPath);
                        console.log("unlink path" + getPath);
                    }

                    user.avatar = req.body.url
                }
            }

            await user.save();
            res.redirect("./home");
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

                        //Tao Token
                        const tokenAccess = jwt.sign({
                            id: user._id,
                            role: user.role.name
                        }, process.env.JWT_ACCESS_KEY, {
                            expiresIn: "1d"
                        });




                        const { password, ...others } = user._doc;
                        const fullToken = `Bearer ${tokenAccess}`

                        // Luu Token vao Cokie
                        res.cookie('access_token', fullToken, {
                            maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống 
                            httpOnly: true, // chỉ có http mới đọc được token
                            //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
                        })



                        console.log("userRender" + {
                            ...others
                        })

                        res.render("userProfile", {
                            user: { ...others }
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
