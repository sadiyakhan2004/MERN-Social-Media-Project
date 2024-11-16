const router = require("express").Router({ mergeParams: true });
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


//Register user
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        await newUser.save();
        res.send("User is registered");
    }
    catch (err) {
        console.log(err);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("Wrong Password!");

        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
    }

})

module.exports = router;