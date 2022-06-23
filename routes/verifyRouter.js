
const middlewareController = require("../controllers/middlewareController");
const userRouter = require("express").Router();
const userController = require("../controllers/userController");

userRouter.get("/account/:token", async(req,res)=>{
    try {
        // check token hop le
        const user = await middlewareController.verifyTokenAccount(req.params.token)
        console.log(user);
        if (!user){
            return res.status(401).json({
                "success":false,
                "message": "authentication fail"
            })
        }

        // enable user
        userController.activeUserAccountByToken(req,res,user.id) 

    } catch (error) {
            res.status(404).json(error.message);
    }
})

userRouter.get("/reset-password/:token", async(req,res)=>{
    try {
        // check token hop le
        const user = await middlewareController.verifyTokenAccount(req.params.token)
        console.log(user);
        console.log(req.params.token);
        if (!user){
            return res.status(401).json({
                "success":false,
                "message": "authentication fail"
            })
        }

        // enable user
        userController.resetPassword(req,res,user.id) 

    } catch (error) {
            res.status(404).json(error.message);
    }
})

userRouter.post("/forgot-password", userController.forgotPassword);




module.exports = userRouter;