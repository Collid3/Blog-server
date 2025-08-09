const blogRouter = require("express").Router();
const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  togglePublish,
  getBlogComments,
  addComment,
  generateAIContent,
} = require("../controllers/blogController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

blogRouter.get("/", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/add", auth, upload.single("image"), createBlog);
blogRouter.put("/:blogId/toggle-publish", auth, togglePublish);
blogRouter.delete("/:blogId", auth, deleteBlog);
blogRouter.post("/generate", auth, generateAIContent);

blogRouter.get("/:blogId/comments", getBlogComments);
blogRouter.post("/comment/add", addComment);

module.exports = blogRouter;
