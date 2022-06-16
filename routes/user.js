const router = require("express").Router();

const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");

//Add User
router.post("/",userController.addUser);

//Get All User
router.get("/",userController.getAllUser);

router.delete("/:id",userController.deleteUserByID);

router.post("/login",userController.loginUser);
module.exports = router;