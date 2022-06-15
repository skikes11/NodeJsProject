const router = require("express").Router();

const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");

//Add User
router.post("/",userController.addUser);

//Get All User
router.get("/",userController.getAllUser);

router.delete("/:id",userController.deleteUserByID);

module.exports = router;