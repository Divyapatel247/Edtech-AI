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
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin",
}));
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.get("/api/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
app.get("/api/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    req.session.user = req.user;
    // req.session.isAuthenticated = true;
    res.redirect("http://localhost:5173/profile");
    console.log("Redirected");
    // console.log("req user:", req.user);
});
// function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
//   if (req.isAuthenticated() && req.session.user) {
//     return next();
//   }
//   res.redirect('/login');
// }
app.get("/api/user/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("req user:", req.session);
    res.status(200).json(req.session.user.displayName);
}));
app.get("/api/user/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("http://localhost:5173"); // will always fire after session is destroyed
    });
});
app.get("/api/db/videos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videos = yield prisma.video.findMany({
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
