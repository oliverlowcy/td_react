const express = require('express')
const router = express.Router()
const {createOTP,authUser,registerUser} = require('../controllers/userControllers')
router.use(express.json());

router.route('/').post(createOTP);
router.route('/register').post(registerUser);
router.post('/login',authUser)


module.exports = router;