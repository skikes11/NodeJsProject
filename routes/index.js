const router = require("express").Router();
const userRouter = require("./userRouter");
const verifyRouter = require("./verifyRouter");
const authRouter = require("./authRouter");

router.use('/users', userRouter)

router.use('/verify',verifyRouter)

router.use('/auth',authRouter)
module.exports = router;