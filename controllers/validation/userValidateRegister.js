const schema = require("./validationSchema")


module.exports = { 
    validateUserregister : async(req,res,next) => { 
         const value = await schema.user.validate(req.body)
         if(value.error){
            res.json({
                "susccess" : false,
                "mesaage" : "validate account error" + value.error.details[0].message
            })
         }else{
            next();
         }
    }
}