const adminRouter = require("express").Router();
const {
  adminLogin,
  getAllCommentsAdmin,
  getAllBlogsAdmin,
  approveCommmentById,
  getDashboardData,
  deleteCommentById,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", auth, getDashboardData);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);

adminRouter.get("/comments", auth, getAllCommentsAdmin);
adminRouter.put("/comment/approve/:commentId", auth, approveCommmentById);
adminRouter.delete("/comment/:commentId", auth, deleteCommentById);

module.exports = adminRouter;
