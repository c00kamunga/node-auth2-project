const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const usersRouter = require('./users/users-router');
const db = require('./database/config');
const server = express();
const port = process.env.PORT || 7890;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "keep it secret, keep it safe",
        store: new knexSessionStore({
            knex:db,
            createTable: true,
        })
    })
);

server.use(usersRouter);
server.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({
        message: "something went wrong",
    })
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});