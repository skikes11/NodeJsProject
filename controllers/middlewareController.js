const jwt = require("jsonwebtoken");

const middlewareController = {

    verifyToken: async (req) => {
        try {
            const token = req.headers.token;
            console.log("token: " + token);
            if (token) {
                const accessToken = token.split(" ")[1];
                console.log("accessToken: " + accessToken);
                const user = await jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                if (user) {
                    return user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },
    verifyTokenAccount: async (token) => {
        try {
            
            console.log("token: " + token);
            if (token) {
                const accessToken = token.split(" ")[1];
                console.log("accessToken: " + accessToken);
                const user = await jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                if (user) {
                    return user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },


}

module.exports = middlewareController;