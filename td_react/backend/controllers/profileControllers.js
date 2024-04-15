const asyncHandler = require("express-async-handler");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");

const createProfile = asyncHandler(async (req, res) => {
    

    try{
        const {name,bio,hobbies,majors,pic} = req.body;
        console.log(name,bio,hobbies,majors,pic)
        const profile = new Profile({name:name,bio:bio,hobbies:hobbies,majors:majors,pic:pic,user:req.user._id})
        await profile.save()
        console.log("PROF",profile)
        res.json(profile)
    }catch(e){
        throw new Error(e.message)
    }

})

const getProfile = asyncHandler(async (req, res) => {
    
    try{
        const profile = await Profile.find({user:req.user._id})
        res.json(profile)
    }catch(e){
        throw new Error(e.message)
    }

})

const stackProfile = asyncHandler(async (req, res) => {

    const meUser = await User.findOne({ _id: req.user._id });
    const likeIds = meUser.like.map(like => like._id);
    const unlikeIds = meUser.unlike.map(unlike => unlike._id);
    const matchIds = meUser.matches.map(match => match._id);

    const profile = await Profile.find({ 
    user: { 
        $ne: req.user._id,
        $nin: [...likeIds, ...unlikeIds, ...matchIds]
    } 
    });
    

    if (profile.length > 0) {
        const randomProfileIndex = Math.floor(Math.random() * profile.length);
        const randomProfile = profile[randomProfileIndex];
        res.json(randomProfile)
    } else {
        throw new Error("No profiles found")
    }

})

const like = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Find the other user by userId
    const otherUser = await User.findOne({ _id: userId });


    if (!otherUser) {
        return res.status(404).json({message: 'User not found' });
    }

    // Check if req.user._id is in otherUser's likes

    if (otherUser.like.length > 0 && otherUser.like.includes(req.user._id)) {
        // Update matches for both users
        const updatedOtherUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { matches: req.user._id } },
            { new: true }
        );

        const updatedMyUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $addToSet: { matches: userId } },
            { new: true }
        );

        return res.status(200).json({ match: true, updatedOtherUser, updatedMyUser });
    } else {
        // Add userId to req.user._id's likes
        const updatedMyUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $addToSet: { like: userId } },
            { new: true }
        );

        return res.status(200).json({ match: false, updatedMyUser });
    }


    //We will find the like of userId and if req.user._id is inside then we will update the matches of both my user obj and userId user obj
    //otherwise we will add the userId to req.user._id likes



})

const unlike = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Update the unlike field for the user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $addToSet: { unlike: userId } }, { new: true });

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json(updatedUser);
});



module.exports = {createProfile,getProfile,stackProfile,like,unlike}