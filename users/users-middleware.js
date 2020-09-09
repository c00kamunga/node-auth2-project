const bcrypt = require('bcryptjs')
const Users = require('./users-model')

function restrict() {
    const authError = {
        message: "invalid credentials"
    }

    return async (req, res, next) => {
        try {
            if(!req.session || !req.session.user) {
                return res.status(401).json(authError)
            }
            next()
        } catch(err) {
            next(err)
        }
    }
}

module.exports = {
    restrict
}