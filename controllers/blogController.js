const { log } = require("console");
const imagekit = require("../config/ImageKit");
const internalServerError = require("../config/internalServerError");
const blogModel = require("../models/Blog");
const commentModel = require("../models/Comment");
const main = require("../config/Gemini");
const fs = require("fs");

const createBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const image = req.file;

    if (!title || !description || !category || !image) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(image.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: image.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, // auto compress
        { format: "webp" }, // Convert to modern format
        { width: 1280 },
      ],
    });

    const newimage = optimizedImageUrl;
    const newBlog = await blogModel.create({
      title,
      subTitle,
      description,
      category,
      image: newimage,
      isPublished,
    });

    return res.status(201).json({
      success: true,
      message: "Blog successfully added",
      blog: newBlog,
    });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const generateAIContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog content for this topic in simple text format"
    );

    return res.json({ success: true, content });
  } catch (error) {
    return internalServerError(res, error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({ isPublished: true });
    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res
        .status(403)
        .json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, blog });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    await blogModel.findByIdAndDelete(blogId);
    await commentModel.deleteMany({ blog: blogId });

    return res.json({ success: true, message: "Blog successfully deleted" });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const togglePublish = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();
    return res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    return internalServerError(res, err);
  }
};

const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    await commentModel.create({
      blog,
      name,
      content,
    });

    return res.json({ success: true, message: "Comment added for review" });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      return res.json({ success: false, message: "Invalid blog id" });
    }

    const comments = await commentModel
      .find({
        blog: blogId,
        isApproved: true,
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, comments });
  } catch (err) {
    return internalServerError(res, err);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  togglePublish,
  deleteBlog,
  addComment,
  getBlogComments,
  generateAIContent,
};
