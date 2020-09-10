const jwt = require('jsonwebtoken')


function restrict() {
    return async (req, res, next) => {
        const authError = {
            message: "Invalid credentials"
        } 
        
        try {
            //assume the oken gets passed to the API as an "Authorization" header
            const token = req.headers.authorization
            if(!token) {
                return res.status(401).json(authError)
            }

            jwt.verify(token, "keep it secret keep it safe", (err, decoded) => {
                if(err) {
                    return res.status(401).json(authError)
                }
                //we know the user is authorized at this point
                //make the token's payload available to other middleware functions
                req.token = decoded
                next()
            })
        } catch(err) {
            next(err)
        }
    }
}

module.exports = {
    restrict
}