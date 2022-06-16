const jwt  = require("jsonwebtoken");

const middlewareController = {

    verifyToken: async (req) => {
        const token = req.headers.token;
        console.log("token: "+token);
        if(token){
            const  accessToken = token.split(" ")[1];
            console.log("accessToken: "+ accessToken);
            const user = await jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
            if (user){
                return user;
            }
            return null;
        }
        return null;
    },   
    verifyTokenAndCheckAdminAuth: (req,res, next)=>{
        middlewareController.verifyToken(req,res,()=>{
            if(req.body.role == "admin"){
                next();
            }else{
                return res.status(403).json({
                    "suscess" : false,
                    "message" : "authorization err "
                });
            } 
        });
    },

    // verifyTest: (req,res,next) => {
    //     const token = req.headers.token;
    //     console.log(token);
    //     if(token){userController.add
    //                 res.status(403).json({
    //                     "suscess": false,
    //                     "message" : "Token is not valid!"                        
    //                 })
    //             }
    //         req.user = user;
    //         if(req.user.role = "admin"){
    //             next();
    //         }
                            
    //         });
    //     }else{
    //         res.status(401).json({
    //             "success" : false,
    //             "message":  "You're not authenticated"
    //         });
    //     }
    // }
}

module.exports= middlewareController;