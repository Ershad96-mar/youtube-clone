const multer = require("multer");
const path = require("path");




/* -----------------
تنظیم محل ذخیره
--------------------*/

const storage = multer.diskStorage({

    destination:function(req,file,callback){

        if(file.fieldname==="video"){

            callback(
                null,
                "public/uploads/videos"
            );

        }

        else{

            callback(
                null,
                "public/uploads/images"
            );

        }

    },

    filename:function(req,file,callback){

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        callback(
            null,
            uniqueName
        );

    }

});

const upload = multer({

    storage:storage

});

module.exports = upload;