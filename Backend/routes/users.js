const router = require("express").Router();
const User = require("../models/user.js");
const mongoose = require("mongoose");

// Update user
router.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
            }
            catch (err) {
                return res.status(500).send(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).send("Account has been updated");
        }
        catch (err) {
            return res.status(500).send(err);
        }

    } else {
        return res.status(403).send("You can update only your account");
    }

});
// Delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).send("Account has been deleted");
        }
        catch (err) {
            return res.status(500).send(err);
        }

    } else {
        return res.status(403).send("You can delete only your account");
    }

});

// Get user
router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password , updatedAt , ...other} = user._doc;
        res.status(200).send(other);
    }
    catch(err){
        res.status(500).send(err);
    }
    
})
// Follow user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId != req.params.id){
      try{
        const user = await User.findById(req.params.id);
        const currUser = await User.findById(req.body.userId);

        if(!user.followers.includes(currUser._id)){
           await User.findByIdAndUpdate( user._id, {$push :{followers : currUser._id}});
           await User.findByIdAndUpdate( currUser._id ,{$push :{following : user._id}});
           res.status(200).send("User has been followed");
        }
        else{
            res.status(403).send("You already follow this user");
        }
      }
      catch(err){
        res.status(500).send(err);
      }    
      
    }
    else{
        res.status(403).send("You can't follow yourself");
    }
})

// Unfollow user
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId != req.params.id){
      try{
        const user = await User.findById(req.params.id);
        const currUser = await User.findById(req.body.userId);
        if(user.followers.includes(currUser._id)){
           await User.findByIdAndUpdate( user._id ,{$pull :{followers : currUser._id}});
           await User.findByIdAndUpdate(currUser._id ,{$pull :{following : user._id}});
           res.status(200).send("User has been unfollowed");
        }
        else{
            res.status(403).send("You don't follow this user");
        }
      }
      catch(err){
        res.status(500).send(err);
      }    
      
    }
    else{
        res.status(403).send("You can't unfollow yourself");
    }
})

module.exports = router;