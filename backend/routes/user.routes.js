import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUsersForSidebar,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  searchUsers
} from "../controllers/user.controller.js";

const router = express.Router();

// Specific routes should come before parameterized routes
router.get("/search", protectRoute, searchUsers);
router.get("/", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getUserById);
router.put("/update", protectRoute, updateUser);
router.delete("/delete", protectRoute, deleteUser);
router.post("/follow/:id", protectRoute, followUser);
router.post("/unfollow/:id", protectRoute, unfollowUser);

export default router;
