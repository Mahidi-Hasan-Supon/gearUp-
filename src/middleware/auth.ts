



      
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { catchAsync } from "../../utiles/catchAsync";
import { jwtUtils } from "../../utiles/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

import httpStatus from "http-status";
import { prisma } from "../lib/prisma";

// namespace
declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        role: UserRole;
        id: string;
      };
    }
  }
}

export const auth = (...requiredRole: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;
    // console.log(token);
    if (!token) {
      throw new Error("You are not log in");
    }
    const verified = jwtUtils.verifyToken(token, config.access_token_secret_key);

    if (!verified.success) {
      throw new Error(verified.error);
    }
    const { email, name, id, role } = verified.data as JwtPayload;

    if (requiredRole.length && !requiredRole.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden,you don't have permission this route ! Because you r not owner",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });
    if (!user) {
      throw new Error("Please Login in");
    }
    if (user.status === "BLOCKED") {
      throw new Error("YOU account has been blocked");
    }

    req.user = {
      id,
      name,
      role,
      email,
    };
    next();
  });
};











