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

router.post('/users', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if(user) {
            return res.status(409).json({
                message: "Username is already taken"
            })
        }
        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 13)
        })

        res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
})