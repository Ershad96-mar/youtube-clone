// ==========================================
// YouTube Clone Server
// SQLite Version
// Part 1
// ==========================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const db = require("./database");

const app = express();

const PORT = 3000;

// ==========================================
// Middlewares
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================================
// Static Files
// ==========================================

app.use(

    express.static(

        path.join(__dirname,"../public")

    )

);

app.use(

    "/uploads",

    express.static(

        path.join(__dirname,"../public/uploads")

    )

);

// ==========================================
// Upload Folder
// ==========================================

const uploadFolder = path.join(

    __dirname,
    "../public/uploads"

);

if(!fs.existsSync(uploadFolder)){

    fs.mkdirSync(uploadFolder,{
        recursive:true
    });

}

// ==========================================
// Multer Storage
// ==========================================

const storage = multer.diskStorage({

    destination:function(req,file,callback){

        callback(null,uploadFolder);

    },

    filename:function(req,file,callback){

        const extension =
        path.extname(file.originalname);

        const filename =
        Date.now() +
        "-" +
        Math.round(Math.random()*1000000) +
        extension;

        callback(null,filename);

    }

});

const upload = multer({

    storage:storage,

    limits:{

        fileSize:500*1024*1024

    }

});

// ==========================================
// Home
// ==========================================

app.get("/",function(req,res){

    res.sendFile(

        path.join(

            __dirname,
            "../public/index.html"

        )

    );

});

// ==========================================
// API Test
// ==========================================

app.get("/api",function(req,res){

    res.json({

        success:true,

        message:"Youtube API Running"

    });

});

// ==========================================
// Upload Video
// ==========================================

app.post(

    "/api/videos",

    upload.fields([

        {
            name:"video",
            maxCount:1
        },

        {
            name:"thumbnail",
            maxCount:1
        }

    ]),

    function(req,res){

        try{

            if(!req.files){

                return res.status(400).json({

                    success:false,
                    message:"Files not found."

                });

            }

            const videoFile =
            req.files.video
            ? req.files.video[0]
            : null;

            const thumbnailFile =
            req.files.thumbnail
            ? req.files.thumbnail[0]
            : null;

            if(!videoFile){

                return res.status(400).json({

                    success:false,
                    message:"Video file required."

                });

            }

            const id =
            Date.now().toString();

            const title =
            req.body.title || "";

            const channel =
            req.body.channel || "My Channel";

            const subscribers =
            req.body.subscribers || "0 Subscribers";

            const views =
            req.body.views || "0 Views";

            const date =
            req.body.date || "Today";

            const description =
            req.body.description || "";

            const avatar =
            req.body.avatar || "M";

            const duration =
            req.body.duration || "00:00";

            const category =
            req.body.category || "General";

            const image =
            thumbnailFile
            ? "/uploads/" + thumbnailFile.filename
            : "";

            const src =
            "/uploads/" + videoFile.filename;

            db.run(

                `

                INSERT INTO videos(

                    id,
                    title,
                    channel,
                    subscribers,
                    views,
                    date,
                    description,
                    image,
                    avatar,
                    duration,
                    category,
                    type,
                    src

                )

                VALUES(

                    ?,?,?,?,?,?,?,?,?,?,?,?,?

                )

                `,

                [

                    id,

                    title,

                    channel,

                    subscribers,

                    views,

                    date,

                    description,

                    image,

                    avatar,

                    duration,

                    category,

                    "site",

                    src

                ],

                function(error){

                    if(error){

                        console.log(error);

                        return res.status(500).json({

                            success:false,
                            message:"Database Error"

                        });

                    }

                    res.json({

                        success:true,

                        message:"Video Uploaded",

                        id:id

                    });

                }

            );

        }

        catch(error){

            console.log(error);

            res.status(500).json({

                success:false,

                message:"Upload Error"

            });

        }

    }

);

// ==========================================
// Get All Videos
// ==========================================

app.get("/api/videos", function (req, res) {

    db.all(

        `
        SELECT *
        FROM videos
        ORDER BY rowid DESC
        `,

        [],

        function (error, rows) {

            if (error) {

                console.log(error);

                return res.status(500).json([]);

            }

            res.json(rows);

        }

    );

});

// ==========================================
// Get Single Video
// ==========================================

app.get("/api/videos/:id", function (req, res) {

    const id = req.params.id;

    db.get(

        `
        SELECT *
        FROM videos
        WHERE id=?
        `,

        [id],

        function (error, row) {

            if (error) {

                console.log(error);

                return res.status(500).json({

                    success: false

                });

            }

            if (!row) {

                return res.status(404).json({

                    success: false,

                    message: "Video not found"

                });

            }

            res.json(row);

        }

    );

});

// ==========================================
// Delete Video
// ==========================================

app.delete("/api/videos/:id", function (req, res) {

    const id = req.params.id;

    db.get(

        `
        SELECT *
        FROM videos
        WHERE id=?
        `,

        [id],

        function (error, video) {

            if (error || !video) {

                return res.status(404).json({

                    success: false

                });

            }

            if (video.src) {

                const videoPath = path.join(

                    __dirname,

                    "../public",

                    video.src

                );

                if (fs.existsSync(videoPath)) {

                    fs.unlinkSync(videoPath);

                }

            }

            if (video.image) {

                const imagePath = path.join(

                    __dirname,

                    "../public",

                    video.image

                );

                if (fs.existsSync(imagePath)) {

                    fs.unlinkSync(imagePath);

                }

            }

            db.run(

                `
                DELETE FROM videos
                WHERE id=?
                `,

                [id],

                function () {

                    res.json({

                        success: true,

                        message: "Video Deleted"

                    });

                }

            );

        }

    );

});

// ==========================================
// Update Video
// ==========================================

app.put("/api/videos/:id", function (req, res) {

    const id = req.params.id;

    db.run(

        `
        UPDATE videos

        SET

        title=?,
        channel=?,
        subscribers=?,
        views=?,
        date=?,
        description=?,
        avatar=?,
        duration=?,
        category=?

        WHERE id=?
        `,

        [

            req.body.title,

            req.body.channel,

            req.body.subscribers,

            req.body.views,

            req.body.date,

            req.body.description,

            req.body.avatar,

            req.body.duration,

            req.body.category,

            id

        ],

        function (error) {

            if (error) {

                console.log(error);

                return res.status(500).json({

                    success: false

                });

            }

            res.json({

                success: true,

                message: "Video Updated"

            });

        }

    );

});

// ==========================================
// Register
// ==========================================

app.post("/api/register", function(req,res){

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if(!username || !email || !password){

        return res.status(400).json({

            success:false,

            message:"Please fill all fields."

        });

    }

    db.get(

        `

        SELECT *

        FROM users

        WHERE email=?

        `,

        [email],

        function(error,user){

            if(user){

                return res.json({

                    success:false,

                    message:"Email already exists."

                });

            }

            db.run(

                `

                INSERT INTO users(

                    username,
                    email,
                    password,
                    avatar,
                    role

                )

                VALUES(

                    ?,?,?,?,?

                )

                `,

                [

                    username,

                    email,

                    password,

                    username.charAt(0).toUpperCase(),

                    "user"

                ],

                function(error){

                    if(error){

                        console.log(error);

                        return res.status(500).json({

                            success:false

                        });

                    }

                    res.json({

                        success:true,

                        message:"Register Success"

                    });

                }

            );

        }

    );

});

// ==========================================
// Login
// ==========================================

app.post("/api/login",function(req,res){

    const email = req.body.email;

    const password = req.body.password;

    db.get(

        `

        SELECT *

        FROM users

        WHERE email=?

        AND password=?

        `,

        [

            email,

            password

        ],

        function(error,user){

            if(error){

                console.log(error);

                return res.status(500).json({

                    success:false

                });

            }

            if(!user){

                return res.json({

                    success:false,

                    message:"User Not Found"

                });

            }

            res.json({

                success:true,

                token:

                Date.now().toString(),

                username:user.username,

                avatar:user.avatar,

                role:user.role

            });

        }

    );

});

// ==========================================
// Get Users
// ==========================================

app.get("/api/users",function(req,res){

    db.all(

        `

        SELECT

        id,
        username,
        email,
        avatar,
        role

        FROM users

        ORDER BY id DESC

        `,

        [],

        function(error,rows){

            if(error){

                return res.status(500).json([]);

            }

            res.json(rows);

        }

    );

});

// ==========================================
// Delete User
// ==========================================

app.delete("/api/users/:id",function(req,res){

    db.run(

        `

        DELETE FROM users

        WHERE id=?

        `,

        [

            req.params.id

        ],

        function(error){

            if(error){

                return res.status(500).json({

                    success:false

                });

            }

            res.json({

                success:true,

                message:"User Deleted"

            });

        }

    );

});

// ==========================================
// Start Server
// ==========================================

app.listen(

    PORT,

    function(){

        console.log("");

        console.log("===================================");

        console.log(" YouTube Clone Server Started");

        console.log(" http://localhost:3000");

        console.log("===================================");

        console.log("");

    }

);