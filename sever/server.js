const videos = require("./videos");
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

const PORT=3000;

/* ---------------------------
   پر کردن اولیه دیتابیس
--------------------------- */

db.get(
    "SELECT COUNT(*) AS count FROM videos",
    function(error, row) {

        if (error) {

            console.log(error.message);
            return;

        }

        if (row.count === 0) {

            videos.forEach(function(video) {

                db.run(

                    `INSERT INTO videos
                    (id,title,channel,subscribers,views,date,description,image,avatar,duration,category,type,src)
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,

                    [

                        video.id,
                        video.title,
                        video.channel,
                        video.subscribers,
                        video.views,
                        video.date,
                        video.description,
                        video.image,
                        video.avatar,
                        video.duration,
                        video.category,
                        video.type,
                        video.src

                    ],

                    function(error){

                        if(error){

                            console.log(error.message);

                        }

                    }

                );

            });

            console.log("Videos inserted into database.");

        }

    }
);

/* صفحه اصلی */

app.get("/",function(req,res){

    res.send("Server Running...");

});

/* گرفتن همه ویدیوها */

app.get("/api/videos",function(req,res){

    db.all(

        "SELECT * FROM videos",

        function(error,rows){

            if(error){

                return res.status(500).json({

                    message:error.message

                });

            }

            res.json(rows);

        }

    );

});

/* گرفتن یک ویدیو */

app.get("/api/videos/:id",function(req,res){

    db.get(

        "SELECT * FROM videos WHERE id=?",

        [req.params.id],

        function(error,row){

            if(error){

                return res.status(500).json({

                    message:error.message

                });

            }

            if(!row){

                return res.status(404).json({

                    message:"Video not found"

                });

            }

            res.json(row);

        }

    );

});

/* افزودن */

app.post("/api/videos",function(req,res){

    const video=req.body;

    db.run(

        `INSERT INTO videos
        (id,title,channel,subscribers,views,date,description,image,avatar,duration,category,type,src)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,

        [

            video.id,
            video.title,
            video.channel,
            video.subscribers,
            video.views,
            video.date,
            video.description,
            video.image,
            video.avatar,
            video.duration,
            video.category,
            video.type,
            video.src

        ],

        function(error){

            if(error){

                return res.status(500).json({

                    message:error.message

                });

            }

            res.json({

                message:"Video Added Successfully"

            });

        }

    );

});

/* حذف */

app.delete("/api/videos/:id",function(req,res){

    db.run(

        "DELETE FROM videos WHERE id=?",

        [req.params.id],

        function(error){

            if(error){

                return res.status(500).json({

                    message:error.message

                });

            }

            res.json({

                message:"Video Deleted"

            });

        }

    );

});

/* ویرایش */

app.put("/api/videos/:id",function(req,res){

    const video=req.body;

    db.run(

        `UPDATE videos
        SET
        title=?,
        channel=?,
        subscribers=?,
        views=?,
        date=?,
        description=?,
        image=?,
        avatar=?,
        duration=?,
        category=?,
        type=?,
        src=?
        WHERE id=?`,

        [

            video.title,
            video.channel,
            video.subscribers,
            video.views,
            video.date,
            video.description,
            video.image,
            video.avatar,
            video.duration,
            video.category,
            video.type,
            video.src,
            req.params.id

        ],

        function(error){

            if(error){

                return res.status(500).json({

                    message:error.message

                });

            }

            res.json({

                message:"Video Updated"

            });

        }

    );

});

app.listen(PORT,function(){

    console.log("Server running on http://localhost:"+PORT);

});