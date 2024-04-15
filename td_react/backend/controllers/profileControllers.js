const asyncHandler = require("express-async-handler");
const Profile = require("../models/profileModel");

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
    
    const profile = await Profile.find({ user: { $ne: req.user._id } });

    if (profile.length > 0) {
        const randomProfileIndex = Math.floor(Math.random() * profile.length);
        const randomProfile = profile[randomProfileIndex];
        res.json(randomProfile)
    } else {
        throw new Error("No profiles found")
    }

})



module.exports = {createProfile,getProfile,stackProfile}