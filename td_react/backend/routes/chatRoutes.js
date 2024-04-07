const express = require("express");
const {
  fetchChats,
  
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats);


module.exports = router;