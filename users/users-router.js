const express = require('express')
const Users = require('./users-model')
const router = express.Router()
const bcrypt = require('bcryptjs')
const usersMiddleware = require('./users-middleware')

router.get("/users", usersMiddleware.restrict(), async(req, res, next) => {
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})