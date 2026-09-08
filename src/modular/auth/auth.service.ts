import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ICreatePayload, ILoginPayload } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../../utiles/jwt";
import { get } from "node:http";

const createUserIntoDB = async (payload: ICreatePayload) => {
  const { name, email, password, role, photoUrl } = payload;

  const isExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isExist) {
    throw new Error("User already Exist");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_hash_pass),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      photoUrl,
    },
    omit: {
      password: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const matchUser = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (matchUser.status === "BLOCKED") {
    throw new Error("User account Blocked");
  }
  const matchPassword = await bcrypt.compare(password, matchUser.password);

  if (!matchPassword) {
    throw new Error("Password incorrect");
  }

  const jwtPayload = {
    id: matchUser.id,
    name: matchUser.name,
    email: matchUser.email,
    role: matchUser.role,
  };
  //   console.log("Access Token Expiry from Config:", config.access_token_expire_in);
  // console.log("Refresh Token Expiry from Config:", config.refresh_token_expire_in);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.access_token_secret_key,
    { expiresIn: config.access_token_expire_in } as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.refresh_token_secret_key,
    { expiresIn: config.refresh_token_expire_in } as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.refresh_token_secret_key,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (user.status === "BLOCKED") {
    throw new Error("User blocked");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.access_token_secret_key,
    { expiresIn: config.access_token_expire_in } as SignOptions,
  );

  return {
    accessToken,
  };
};

const googleClient = new OAuth2Client(config.google_client_id);

const googleLogin = async (
  credential: string,
  role?: "CUSTOMER" | "PROVIDER",
) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.google_client_id,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Google account email not found");
  }

  const email = payload.email;
  const name = payload.name || "Google User";
  const photoUrl = payload.picture || null;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // যদি আগে থেকেই user থাকে
  if (user) {
    if (user.role === "ADMIN") {
      throw new Error("Admin cannot login with Google");
    }

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        photoUrl: photoUrl || user.photoUrl,
      },
    });
  }

  // নতুন Google user
  else {
    if (!role) {
      throw new Error(
        "Please select Customer or Provider before creating an account",
      );
    }

    const randomPassword = crypto.randomUUID();

    const hashPassword = await bcrypt.hash(
      randomPassword,
      Number(config.bcrypt_hash_pass),
    );

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        photoUrl,
        role,
      },
    });
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.access_token_secret_key,
    {
      expiresIn: config.access_token_expire_in,
    } as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.refresh_token_secret_key,
    {
      expiresIn: config.refresh_token_expire_in,
    } as SignOptions,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  createUserIntoDB,
  loginUser,
  getMyProfile,
  refreshToken,
  googleLogin,
};
