const userRouter = require("express").Router();

const { verifyTokenAndCheckAdminAuth } = require("../controllers/middlewareController");
const middlewareController = require("../controllers/middlewareController");
const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");

//Add User
userRouter.post("/", userController.addUser);

//Get All User
userRouter.get("/", async (req, res) => {
    const user = await middlewareController.verifyToken(req)
    console.log(user)
    if (!user){
        res.status(401).json({
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

// userRouter.delete("/:id",middlewareController.verifyTokenAndCheckAdminAuth,userController.deleteUserByID);

userRouter.post("/login",userController.loginUser);
module.exports = userRouter;