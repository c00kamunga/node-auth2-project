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

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if(!user) {
            return res.status(401).json({
                message: "Username or password is incorrect"
            })
        }
        
        const passwordValid = await bcrypt.compare(password, user.password)

        if(!passwordValid) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        req.session.user = user

        res.json({
            message: `Welcome ${user.username}`
        })
    } catch(err) {
        next(err)
    }
})

router.get('/logout', usersMiddleware.restrict(), async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if(err){
                next(err)
            } else {
                res.status(204).end()
            }
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router