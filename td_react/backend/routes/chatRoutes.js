const express = require("express");
const {
  fetchChats,accessChat
  
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats);
router.route("/").post(protect, accessChat);


module.exports = router;