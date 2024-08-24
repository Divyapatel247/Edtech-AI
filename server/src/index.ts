import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import "./passport-setup";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/upload";
import jwt from "jsonwebtoken";
import { verifyToken } from "./verifyToken";
import cookieParser from "cookie-parser";

declare module "express-session" {
  interface Session {
    user?: any;
    // isAuthenticated?: boolean; // Replace 'any' with the actual type of your user object if known
  }
}

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin",
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.json());

app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route for Google authentication
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user.id, name: user.name }, "JWT_SECRET", {
      expiresIn: "1h",
    });
    // res.send(token);
    res.cookie("token", token); // Set secure to true if using HTTPS
    res.redirect("http://localhost:5173/profile");
    // console.log(user);
  }
);
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  const video = await prisma.video.findMany();
  res.status(200).json({ users, video });
});
// Route to get the authenticated user's profile
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    // const user = req.user as any;
    // console.log("req user:", req.user);
    // res.status(200).json(user);
    const userId = (req.user as any).id;

    const user = await prisma.user.findUnique({
      where: { googleId: userId },
      select: { id: true, name: true, email: true }, // Adjust the fields as needed
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
  // const user = req.user as any;
  // console.log("req user:", req.user);
  // res.status(200).json(user.name.familyName);
});
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

app.get("/api/db/videos", verifyToken, async (req, res) => {
  console.log("req user:", req.user);
  const userId = (req.user as any).id;
  const videos = await prisma.video.findMany({
    where: { userId: userId },
    select: { key: true },
  });
  const keys = videos.map((video) => video.key.replace(".mp4", ""));
  console.log(keys);
  res.send(keys);
});

app.use("/api/upload", uploadRoutes);

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
function next(err: any): void {
  throw new Error("Function not implemented.");
}
