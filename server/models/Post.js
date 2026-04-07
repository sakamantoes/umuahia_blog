import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    category: {
      type: String,
      enum: [
        "News & Updates",
        "Opportunities",
        "Lifestyle",
        "Culture",
        "Stories",
        "Resources",
      ],
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [300, "Summary cannot exceed 300 characters"],
    },
    image: {
      type: String,
      default: null
    },
    imagePublicId: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Increment views
PostSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Index for search
PostSchema.index({ title: "text", content: "text", tags: "text" });

const Post = mongoose.model("Post", PostSchema);

export default Post;
