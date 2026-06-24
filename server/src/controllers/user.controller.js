import { getAuth } from "@clerk/express";
import asyncHandler from "../utils/asyncHandler.js";
import * as userService from "../services/user.service.js";

// POST /api/v1/user
const createUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { user, created } = await userService.createUser(userId, req.body);
  res.status(created ? 201 : 200).json(user);
});


// GET /api/v1/user/me
const getUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// PATCH /api/v1/user/me
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user._id, req.body);
  res.json(user);
});

// DELETE /api/v1/user/me
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.user._id);
  res.json({ message: "Account deleted successfully" });
});

export { createUser, getUser, updateUser, deleteUser };
