import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.cookies.token; // Ensure req.cookies is defined
  console.log("Token received:", token); // Add logging
  if (token) {
    jwt.verify(token, "JWT_SECRET", (err: any, user: any) => {
      if (err) {
        console.log("JWT verification error:", err); // Add logging
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    console.log("No token found"); // Add logging
    res.sendStatus(401);
  }
};
