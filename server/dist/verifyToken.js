"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Ensure req.cookies is defined
    console.log("Token received:", token); // Add logging
    if (token) {
        jsonwebtoken_1.default.verify(token, "JWT_SECRET", (err, user) => {
            if (err) {
                console.log("JWT verification error:", err); // Add logging
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    else {
        console.log("No token found"); // Add logging
        res.sendStatus(401);
    }
};
exports.verifyToken = verifyToken;
