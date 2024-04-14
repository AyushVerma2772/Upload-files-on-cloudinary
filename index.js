const express = require("express");
const mongoose = require('mongoose');
const fs = require("fs");
const { join } = require("path");

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/uploadFiles')
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err))


app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"))
app.use(express.urlencoded());
app.use(express.json());


//? Step 1: Require Multer and Cloudinary
const multer = require('multer');
const cloudinary = require("cloudinary").v2;


//? Step 2: Define Disk Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniquePrefix + file.originalname);
    }
});


//? Step 3: Initialize Multer with Storage Configuration
const upload = multer({ storage: storage });


// cloudinary config
cloudinary.config({
    cloud_name: '*******',
    api_key: '********',
    api_secret: '********'
});


const filesUrl = []

app.get("/", (req, res) => {
    res.render("index", { filesUrl })
})


// ******************* For a single file ************************
/*
//? Step 4: Use Upload Middleware in Route Handler
app.post("/file/upload", upload.single('myFile'), async (req, res) => {

    // console.log("Request file:", req.file);
    const filePath = req.file.path;

    //? Step 5: Upload File to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);
    // console.log("Cloudinary result:", result)
    console.log("Url of image:", result.secure_url);

    //? Step 6: Delete File from Local Server
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
        else console.log("Delete hogayi ha");
    });

    //? Step 7: Send Response to User
    res.json({
        msg: "file uploaded",
        url: result.secure_url
    });
});
*/



// ******************* For a multiple files ***********************
app.post('/files/upload', upload.array("files", 10), async (req, res) => {
    const files_array = req.files;

    for (let file of files_array) {
        let filePath = file.path;

        let result = await cloudinary.uploader.upload(filePath);
        filesUrl.push(result.url);

        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
            else console.log("File deleted");

        })
    }


    res.redirect("/")


})



app.listen(8080, () => {
    console.log("Server is running at http://localhost:8080")
})