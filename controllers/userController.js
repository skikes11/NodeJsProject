const {UserAccount} = require("../model/userModel");
const registerValidation = require("./validation");

const userController = {
    // Add User
    addUser: async(req,res)=>{
      //  const error  = registerValidation(req.body);
       // if(error){
      //   return res.status(400).send(error);
     //   }else{
        try{
            const {username, password, name, dob, email, phone} = req.body;
            //const salt = await bcrypt.genSalt(10);
            //const hashPass = await bcrypt.hash(password, salt);
            const newUser = new UserAccount({
               username: username,
               password: hashPass,
               name: name,
               profile: {
                   dob: dob,
                   email : email,
                   phone : phone,
               }
            });
             await newUser.save();   
            res.status(200).json(newUser);
        }catch(err){
           res.status(500).json(err);
        }
  //  }

    },
    getAllUser : async(req,res)=>{
        try{
            const users = await UserAccount.find();           
            // Update InforUserID for user
            res.status(200).json(users);               
        }catch(err){
           res.status(500).json(err);
        }
    },
    deleteUserByID : async(req,res)=>{
        try{
            await UserAccount.findByIdAndDelete(req.params.id);           
            // Update InforUserID for user
            res.status(500).json("DELETE USER SUSCESS");
        }catch(err){
           res.status(500).json(err);
        }
    }
};

module.exports = userController;