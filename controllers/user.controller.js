import { catchAsync } from "../helpers/catchAsync.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import appError from "../utilities/appError.js";
import { prisma } from '../config/prismaConfig.js'


export const signUp = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (
    !name ||
    !email ||
    !password
  ) {
    return next(new appError("Please fill in all fields.", 400));
  }

  const lowerCaseEmail = email.toLowerCase();

  const doesEmailExist = await prisma.user.findUnique({
    where: {
      email: lowerCaseEmail,
    },
  });

  if (doesEmailExist) return next(new appError("email already exists", 409));

  if (password.trim().length < 8) {
    return next(new appError("Password must be at least 8 characters"), 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
    },
  });

  if (!user) {
    return next(new appError("User Registration failed", 422));
  }

  res
    .status(201)
    .json({ message: `New user ${user.email} is registered`, data: user });
});

export const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Fill in all fields.", 400));
  }

  const lowerCaseEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: lowerCaseEmail,
    },
  });

  if (!user) {
    return next(new appError("User Not Found.", 404));
  }

  const comparePasswords = bcrypt.compare(password, user.password);

  if (!comparePasswords) {
    return next(new appError("Invalid Password.", 400));
  }

  const { id, name } = user;

  const token = jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.status(200).json({ token, id, name });
});

export const getUsers = catchAsync(async (req, res, next) => {

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!users) {
    return next(new appError("No Users Found", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
});


export const getSpecificUser = catchAsync(async (req, res, next) => {

  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return next(new appError('No User Found', 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: { user },
  });
})