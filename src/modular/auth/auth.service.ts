import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ICreatePayload, ILoginPayload } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../../utiles/jwt";
import { get } from "node:http";

const createUserIntoDB = async (payload: ICreatePayload) => {
  const { name, email, password, role } = payload;

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
   {expiresIn: config.access_token_expire_in} as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.refresh_token_secret_key,
  {expiresIn: config.refresh_token_expire_in}  as SignOptions,
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
    config.refresh_token_secret_key,
   {expiresIn: config.refresh_token_expire_in} as SignOptions,
  );


  return {
    accessToken
  };
};

export const authService = {
  createUserIntoDB,
  loginUser,
  getMyProfile,
  refreshToken,
};
