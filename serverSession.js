const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret : process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
  ];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.json({ message: 'Login successful'});
    } else {
        res.status(401).json({ error: 'Unauthorized'})
    }
});

app.post('logout', (req, res) => {
    res.session.destroy(err => {
        if (err) {
            res.status(500).json({ error: 'Server error'});
        } else {
            res.json({ message: 'Logout successful'});
        }
    });
});

const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized'})
    }
};

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port : ${PORT}`)
});