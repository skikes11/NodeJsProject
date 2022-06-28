const schema = require("./validationSchema")

const UserValidate = { 
    validateUserregister : async(req,res,next) => { 
        console.log("##" + req.body);
         const value = await schema.user.validate(req.body)
         if(value.error){
            res.json({
                "susccess" : false,
                "mesaage" : "validate account error" + value.error.details[0].message
            })
         }else{
            next();
         }
    },
    validatePassword: (req,res,next) =>{

        if(req.body.password != req.body.rePassword){
            return  res.render("register", {
                  mess :  " Password and repeat password did not match "
              });
        }else{
            next();
        }

    }
}

module.exports = UserValidate;