// ==========================================
// YouTube Clone Server (SUPABASE VERSION)
// ==========================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// SUPABASE CONFIG (اینجا را پر کن)
// ==========================================

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
// Static
// ==========================================

app.use(express.static(path.join(__dirname, "../public")));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ==========================================
// Upload folder
// ==========================================

const uploadFolder = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// ==========================================
// Multer
// ==========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e6) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ==========================================
// API TEST
// ==========================================

app.get("/api", (req, res) => {
    res.json({ success: true, message: "API Running (Supabase)" });

});

// ==========================================
// UPLOAD VIDEO
// ==========================================

app.post("/api/videos", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {

    try {

        const videoFile = req.files.video?.[0];
        const thumbnailFile = req.files.thumbnail?.[0];

        if (!videoFile) {
            return res.status(400).json({ success: false, message: "Video required" });
        }

        const payload = {
            id: Date.now().toString(),
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

        const { error } = await supabase.from("videos").insert([payload]);

        if (error) {
            return res.status(500).json({ success: false, error });
        }

        res.json({ success: true, message: "Uploaded", id: payload.id });

    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
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

    if (error) return res.status(500).json([]);

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

    if (error) return res.status(404).json({ success: false });

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

    if (error) return res.status(500).json({ success: false });

    res.json({ success: true });
});

app.put("/api/videos/:id", async (req, res) => {

    const { error } = await supabase
        .from("videos")
        .update({
            title: req.body.title,
            channel: req.body.channel,
            subscribers: req.body.subscribers,
            views: req.body.views,
            date: req.body.date,
            description: req.body.description,
            avatar: req.body.avatar,
            duration: req.body.duration,
            category: req.body.category
        })
        .eq("id", req.params.id);

    if (error) {
        return res.status(500).json({ success: false });
    }

    res.json({ success: true });
});

// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", async (req, res) => {

    const { username, email, password } = req.body;

    const { data: exists } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (exists) {
        return res.json({ success: false, message: "Email exists" });
    }

    const { error } = await supabase.from("users").insert([{
        username,
        email,
        password,
        avatar: username.charAt(0),
        role: "user"
    }]);

    if (error) return res.status(500).json({ success: false });

    res.json({ success: true });
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
        .eq("password", password)
        .single();

    if (!data) {
        return res.json({ success: false, message: "Not found" });
    }

    res.json({
        success: true,
        token: Date.now().toString(),
        username: data.username,
        avatar: data.avatar,
        role: data.role
    });
});


app.get("/api/users", async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("id,username,email,avatar,role")
        .order("id", { ascending: false });

    if (error) {
        return res.status(500).json([]);
    }

    res.json(data);
});

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
    console.log("Server running on port", PORT);
});