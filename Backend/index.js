const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts.js");


dotenv.config();

const dbUrl = process.env.MONGO_URL;

main()
.then((res)=>{
    console.log("conneted to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
   await mongoose.connect(dbUrl);
};

//middleware
// app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(8080, () => {
    console.log("Backend server is running!");
})
