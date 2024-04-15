const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    var results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      
    results = await Chat.populate(results, {
      path: "latestMessage.sender",
      select: "name email",
    });

    const plainResults = results.map(result => result.toObject());
    for (const result of plainResults) {
      let profile;
     
      if (result.users[0]._id.equals(req.user._id)) {
        profile = await Profile.find({ user: result.users[1]._id });
        
      } else {
        profile = await Profile.find({ user: result.users[0]._id });
        
      }
      
      result.oppProfile = profile[0];
      
    };
    res.status(200).send(plainResults);



    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



module.exports = {
  fetchChats,accessChat

};