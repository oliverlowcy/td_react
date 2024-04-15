const express = require('express')
const router = express.Router()
const {createProfile,getProfile,stackProfile} = require('../controllers/profileControllers')
const {protect} = require("../middleware/authMiddleware")


router.use(express.json());

router.route('/').post(protect,createProfile);
router.route('/').get(protect,getProfile);
router.route('/stack').get(protect,stackProfile);



module.exports = router;