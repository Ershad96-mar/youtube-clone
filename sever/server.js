// ==========================================
// YouTube Clone Server (Supabase Version)
// ==========================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Supabase Setup
// ==========================================

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ==========================================
// Middlewares
// ==========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static Files
// ==========================================

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ==========================================
// Upload Folder
// ==========================================

const uploadFolder = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// ==========================================
// Multer Setup
// ==========================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = Date.now() + "-" + Math.round(Math.random() * 1000000) + ext;
        cb(null, name);
    }
});

const upload = multer({ storage });

// ==========================================
// Home
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ==========================================
// API TEST
// ==========================================

app.get("/api", (req, res) => {
    res.json({ success: true, message: "API Running" });
});

// ==========================================
// UPLOAD VIDEO (Supabase)
// ==========================================

app.post("/api/videos", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {

    try {

        const videoFile = req.files.video ? req.files.video[0] : null;
        const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

        if (!videoFile) {
            return res.status(400).json({
                success: false,
                message: "Video required"
            });
        }

        const id = Date.now().toString();

        const newVideo = {
            id,
            title: req.body.title || "",
            channel: req.body.channel || "My Channel",
            subscribers: req.body.subscribers || "0",
            views: req.body.views || "0",
            date: req.body.date || "Today",
            description: req.body.description || "",
            image: thumbnailFile ? "/uploads/" + thumbnailFile.filename : "",
            avatar: req.body.avatar || "M",
            duration: req.body.duration || "00:00",
            category: req.body.category || "General",
            type: "site",
            src: "/uploads/" + videoFile.filename
        };

        const { error } = await supabase
            .from("videos")
            .insert([newVideo]);

        if (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Video Uploaded",
            id
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// ==========================================
// GET ALL VIDEOS
// ==========================================

app.get("/api/videos", async (req, res) => {

    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        return res.status(500).json([]);
    }

    res.json(data);
});

// ==========================================
// GET SINGLE VIDEO
// ==========================================

app.get("/api/videos/:id", async (req, res) => {

    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", req.params.id)
        .single();

    if (error) {
        return res.status(404).json({ success: false });
    }

    res.json(data);
});

// ==========================================
// DELETE VIDEO
// ==========================================

app.delete("/api/videos/:id", async (req, res) => {

    const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", req.params.id);

    if (error) {
        return res.status(500).json({ success: false });
    }

    res.json({ success: true, message: "Deleted" });
});

// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fill all fields"
        });
    }

    const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

    if (existing.length > 0) {
        return res.json({
            success: false,
            message: "Email exists"
        });
    }

    const { error } = await supabase
        .from("users")
        .insert([{
            username,
            email,
            password,
            avatar: username.charAt(0).toUpperCase(),
            role: "user"
        }]);

    if (error) {
        return res.status(500).json({ success: false });
    }

    res.json({ success: true, message: "Registered" });
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password);

    if (error || data.length === 0) {
        return res.json({
            success: false,
            message: "Invalid login"
        });
    }

    const user = data[0];

    res.json({
        success: true,
        token: Date.now().toString(),
        username: user.username,
        avatar: user.avatar,
        role: user.role
    });
});

// ==========================================
// USERS
// ==========================================

app.get("/api/users", async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("id, username, email, avatar, role");

    if (error) {
        return res.status(500).json([]);
    }

    res.json(data);
});

// ==========================================
// DELETE USER
// ==========================================

app.delete("/api/users/:id", async (req, res) => {

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", req.params.id);

    if (error) {
        return res.status(500).json({ success: false });
    }

    res.json({ success: true });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});