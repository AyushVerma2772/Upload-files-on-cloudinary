# File upload using multer and cloudinary

## Steps
- Step 1: Require Multer and Cloudinary
- Step 2: Define Disk Storage
- Step 3: Initialize Multer with Storage Configuration
- Step 4: Use Upload Middleware in Route Handler
- Step 5: Upload File to Cloudinary
- Step 6: Delete File from Local Server
- Step 7: Send Response to User



## Step 1: Require Multer and Cloudinary
``` javascript
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
```

## Step 2: Define Disk Storage
``` javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniquePrefix + file.originalname);
    }
});
```

## Step 3: Initialize Multer with Storage Configuration
``` javascript
const upload = multer({ storage: storage });
```

## Step 4: Use Upload Middleware in Route Handler
``` javascript
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
```

### For multiple files 
you just need to use ```upload.array("files", 10)``` and ```req.files``` and loop through it. 
