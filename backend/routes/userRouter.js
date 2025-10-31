const express = require('express');
const app = express();
const userModel = require('../models/user-model');
const router = express.Router();
const { createUser, loginUser, logout } = require('../controllers/authControllers');
const citizenModel = require('../models/citizen-model');
const departmentModel = require('../models/department-model');
const isloggedin = require('../middlewares/isLoggedin');
const isLoggedin = require('../middlewares/isLoggedin');


router.get("/", (req, res) => {
    res.send("Hi User");
})
router.post('/create', createUser);

router.post('/login', loginUser);


router.get('/api/me', isloggedin, (req, res)=>{
    res.json(req.user);
})

router.post('/logout', logout);

module.exports = router;