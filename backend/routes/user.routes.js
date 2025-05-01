import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUsersForSidebar,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getSuggestions
} from "../controllers/user.controller.js";

const router = express.Router();

// Specific routes should come before parameterized routes
router.get("/suggestions", protectRoute, getSuggestions);
router.get("/", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getUserById);
router.put("/", protectRoute, updateUser);
router.delete("/", protectRoute, deleteUser);
router.post("/follow/:userId", protectRoute, followUser);
router.post("/unfollow/:userId", protectRoute, unfollowUser);

export default router;
