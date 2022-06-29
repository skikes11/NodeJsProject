const userRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");
const userValidate = require("../controllers/validation/userValidateRegister");
const logger = require("../controllers/logger/winstonLogger");
const { UserAccount } = require("../model/userModel");
const { Console } = require("winston/lib/winston/transports");





//User login View
userRouter.get("/home",async(req,res)=>{

    const token = req.cookies.access_token;

    console.log("token cookie " + token);

    if(token){
        const user_token = await middlewareController.verifyTokenAccount(token);

        const user = await UserAccount.findById(user_token.id);


        console.log("token ++" + user);

        if(user){
            return res.render("userProfile",{
                user : user
            })
        }


    }


    res.render("index");
})

//Forgot Password View
userRouter.get("/forgot-password",function(req,res){
    res.render("forgotPassword", {
        mess : ""
    });
})


//Reset Password Completed View
userRouter.get("/reset-password-completed",function(req,res){
    res.render("resetPasswordCompleted")
})


// Register View

userRouter.get("/register",function(req,res){
    res.render("register",{mess : ""});
})


// Reset Password View
userRouter.get("/reset-password",function(req,res){
    res.render("resetPassword");
})


// Registration complete view


userRouter.get("/registration-completed",function(req,res){
    res.render("registrationComplete");
})


//Add User 
userRouter.post("/addUser", (req,res)=>{
    userController.addUser(req,res);
});

//AddRole
userRouter.post("/r2", async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    console.log(user)
    if (!user){
        return res.status(401).json({
            "success":false,
            "message": "authentication fail"
        })
    }

   if (user.role == "admin"){
        userController.addRole(req,res)
   }else{
        res.status(403).json({
            "success":false,
            "message": "permission denied"
        })
   }
});

//Get All User (auth: ADMIN)
userRouter.get("/", async (req, res) => {
    const user = await middlewareController.verifyToken(req,res)
    console.log(user)
    if (!user){
        logger.info({
            "success" : false,
            "message" : "did not found any user"
           });
        return res.status(401).json({
            "success":false,
            "message": "authentication fail"
        });
    }

    if (user.role == "admin"){
        getAllUser(req,res);
    }else{
        res.status(403).json({
            "success":false,
            "message": "permission deny"
        })
    }
});

//Get All Role (auth: ADMIN)
userRouter.get("/r1", async (req, res) => {
    const user = await middlewareController.verifyToken(req,res)
    console.log(user)
    if (!user){
        return res.status(401).json({
            "success":false,
            "message": "authentication fail"
        })
    }

    if (user.role== "admin"){
        userController.getAllRole(req,res);
    }else{
        res.status(403).json({
            "success":false,
            "message": "permission deny"
        })
    }
});


//UPDATE USER BY ID (auth : ADMIN)
userRouter.put("/v2/:id", async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    console.log(user);

    if(!user){
        res.status(401).json({
            "success":false,
            "message": "authentication failed"
        })
    }else{
    if(user.role == "admin"){
        userController.UpdateUserByID(req,res,req.params.id);
    }else{
        res.status(403).json({
            "success":false,
            "message": "Authorization failed"
        })
    }
    }
});

//LOG OUT
userRouter.get("/logout", async(req,res)=>{

    res.clearCookie('access_token');
    res.redirect('./home')

});

//Load Profile Update
userRouter.get("/loadUpdate", async(req,res)=>{

    const token = req.cookies.access_token;

    if(!token){
        return res.status(403).json({
            mess : "invalid token access"
        })
    }

    const user_token = await middlewareController.verifyTokenAccount(token);

    const user = await UserAccount.findById(user_token.id)

    if(!user){
        return res.status(403).json({
            mess : "invalid token access"
        })
    }else{
        res.render("updateUser",{
            user : user,
            mess : ""
        })
    }

});

//UPDATE USER BY TOKEN
userRouter.post("/update", middlewareController.uploadFileImage().single("avatar"),  async(req,res)=>{
    const token = req.cookies.access_token;

    if(!token){
        return res.status(403).json({
            mess : "invalid token access"
        })
    }

    const user = await middlewareController.verifyTokenAccount(token);
    console.log(user);
    if(user){
        userController.UpdateUserByToken(req,res,user.id);
    }else{
        res.status(401).json({
            "success":false,
            "message": "authentication fail"
        })
    }
});
//DELETE USER BY ID (auth: ADMIN)
userRouter.delete("/:id",async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    console.log(user);

    if(!user){
        res.status(401).json({
            "success":false,
            "message": "authentication failed"
        })
    }else{
    if(user.role == "admin"){
        userController.deleteUserByID(res,req.params.id);
    }else{
        res.status(403).json({
            "success":false,
            "message": "Authorization failed"
        })
    }
    }
});

//BLOCK OR UNBLOCK USER BY ID (auth : ADMIN)
userRouter.put("/:id",async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    console.log(user);

    if(!user){
        res.status(401).json({
            "success":false,
            "message": "authentication failed"
        })
    }else{
    if(user.role == "admin"){
        userController.activeOrBlockUserAccountByID(res, req.params.id);
    }else{
        res.status(403).json({
            "success":false,
            "message": "Authorization failed"
        })
    }
    }
});

//CHANGE USER PASSWORD
userRouter.put("/u1/pass", async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    
    if(user){
        console.log("get in controller");
        userController.ChangeUserPassword(req,res,user.id);
    }else{
        res.status(401).json({
            "success":false,
            "message": "authentication fail"
        })
    }
});


//LOGIN USER
userRouter.post("/login",userController.loginUser);
module.exports = userRouter;