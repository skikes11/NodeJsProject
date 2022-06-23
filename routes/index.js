const router = require("express").Router();
const userRouter = require("./userRouter");
const verifyRouter = require("./verifyRouter");

router.use('/users', userRouter)

router.use('/verify',verifyRouter)


module.exports = router;