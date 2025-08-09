const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../models/Blog");
const commentModel = require("../models/Comment");
const internalServerError = require("../config/internalServerError");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password required",
      });
    }

    if (
      email !== process.env.AdminEmail ||
      password !== process.env.AdminPassword
    ) {
      return res.json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + err.message,
    });
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await commentModel
      .find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const getDashboardData = async (req, res) => {
  try {
    const recentBlogs = await blogModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5);

    const blogs = await blogModel.countDocuments();
    const comments = await commentModel.countDocuments();
    const drafts = await blogModel
      .find({ isPublished: false })
      .countDocuments();

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    return res.json({ success: true, dashboardData });
  } catch (err) {
    return internalServerError(res, err);
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    await commentModel.findByIdAndDelete(commentId);
    return res.json({ success: true, message: "Comment successfully deleted" });
  } catch (error) {
    return internalServerError(res, error);
  }
};

const approveCommmentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    await commentModel.findByIdAndUpdate(commentId, { isApproved: true });

    return res.json({
      success: true,
      message: "Comment approved successfully",
    });
  } catch (error) {
    return internalServerError(res, error);
  }
};

const admingLogout = async (req, res) => {};

module.exports = {
  adminLogin,
  getAllBlogsAdmin,
  getAllCommentsAdmin,
  getAllCommentsAdmin,
  getDashboardData,
  deleteCommentById,
  approveCommmentById,
};
