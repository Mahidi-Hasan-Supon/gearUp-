import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import { catchAsync } from "../../../utiles/catchAsync";
import { sendResponse } from "../../../utiles/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../../utiles/jwt";
import { ref } from "node:process";
import { uploadToCloudinary } from "../../../utiles/xcloudinaryUpload";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    // ছবি থাকলে Cloudinary-তে upload হবে
    if (req.file) {
      const photoUrl = await uploadToCloudinary(req.file.buffer);

      body.photoUrl = photoUrl;
    }

    const result = await authService.createUserIntoDB(body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: {
        result,
      },
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    // console.log(body, "body");
    const { accessToken, refreshToken } = await authService.loginUser(body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const {accessToken} = req.cookies

    //  console.log(req.user?.id);

    const result = await authService.getMyProfile(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get my profile",
      data: result,
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken);

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Refresh token retrieved",
      data: {
        accessToken,
      },
    });
  },
);

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { credential, role } = req.body;

  if (!credential) {
    throw new Error("Google credential is required");
  }

  const result = await authService.googleLogin(credential, role);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Google login successful",
    data: {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        photoUrl: result.user.photoUrl,
      },
    },
  });
});

export const authController = {
  createUser,
  loginUser,
  getMyProfile,
  refreshToken,
  googleLogin
};
