const userRouter = require("express").Router();

const { verifyTokenAndCheckAdminAuth } = require("../controllers/middlewareController");
const middlewareController = require("../controllers/middlewareController");
const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");
const userValidateRegister = require("../controllers/validation/userValidateRegister");
//Add User 
userRouter.post("/", userValidateRegister.validateUserRegister, userController.addUser);

//AddRole
userRouter.post("/r2", async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res)
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
        return res.status(401).json({
            "success":false,
            "message": "authentication fail"
        })
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




//UPDATE USER BY TOKEN
userRouter.put("/", async(req,res)=>{
    const user = await middlewareController.verifyToken(req,res);
    console.log(user);
    if(user){
        userController.UpdateUserByID(req,res,user.id);
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
        userController.BlockORUnblockUserbyID(res, req.params.id);
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
    console.log("halo" + user);
  
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