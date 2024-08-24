"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./passport-setup");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const upload_1 = __importDefault(require("./routes/upload"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = require("./verifyToken");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin",
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express_1.default.json());
app.get("/api/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
// Callback route for Google authentication
app.get("/api/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, "JWT_SECRET", {
        expiresIn: "1h",
    });
    // res.send(token);
    res.cookie("token", token); // Set secure to true if using HTTPS
    res.redirect("http://localhost:5173/profile");
    // console.log(user);
});
app.get("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    const video = yield prisma.video.findMany();
    res.status(200).json({ users, video });
}));
// Route to get the authenticated user's profile
app.get("/api/user/profile", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = req.user as any;
        // console.log("req user:", req.user);
        // res.status(200).json(user);
        const userId = req.user.id;
        const user = yield prisma.user.findUnique({
            where: { googleId: userId },
            select: { id: true, name: true, email: true }, // Adjust the fields as needed
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    // const user = req.user as any;
    // console.log("req user:", req.user);
    // res.status(200).json(user.name.familyName);
}));
// Route to log out the user
app.get("/api/user/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).send("Logged out successfully");
});
// app.get(
//   "/api/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     req.session.user = req.user;
//     // req.session.isAuthenticated = true;
//     res.redirect("http://localhost:5173/profile");
//     console.log("Redirected");
//     // console.log("req user:", req.user);
//   }
// );
// app.get("/api/user/profile", async (req, res) => {
//   // console.log("req user:", req.session);
//   res.status(200).json(req.session.user.displayName);
// });
// app.get("/api/user/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("http://localhost:5173"); // will always fire after session is destroyed
//   });
// });
app.get("/api/db/videos", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req user:", req.user);
    const userId = req.user.id;
    const videos = yield prisma.video.findMany({
        where: { userId: userId },
        select: { key: true },
    });
    const keys = videos.map((video) => video.key.replace(".mp4", ""));
    console.log(keys);
    res.send(keys);
}));
app.use("/api/upload", upload_1.default);
// app.get("/api/profile", async (req, res) => {
//   try {
//     if (!req.isAuthenticated()) {
//       return res.redirect("/");
//     }
//     const userId = req.user;
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!user) {
//       throw new Error("User not found");
//     }
//     res.send(`Hello ${user.name}`);
//   } catch (error) {
//     res.status(500).send("error");
//   }
// });
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
function next(err) {
    throw new Error("Function not implemented.");
}
