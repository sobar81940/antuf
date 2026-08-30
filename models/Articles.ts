import mongoose from "mongoose";
import "./subcategory"; // Side-effect import: ensures SubCategory model is registered in Mongoose's registry for populate()

// Lecture/Content Schema - Individual content pieces within sections
const LectureSchema = new mongoose.Schema(
  {
    idindex: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
    },
    excerpt: {
      type: String,
      maxLength: [300, "Excerpt cannot exceed 300 characters"],
    },
    videourl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/.test(v);
        },
        message: "Please provide a valid video URL"
      }
    },
    videoThumbnail: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      min: 0,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Section Schema - Groups of related lectures/content
const SectionSchema = new mongoose.Schema(
  {
    idindex: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    featureImage: {
      type: String,
      trim: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    lectures: [LectureSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for lecture count
SectionSchema.virtual("lectureCount").get(function() {
  return this.lectures ? this.lectures.length : 0;
});

// Main Articles Schema
const ArticlesSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      minLength: [5, "Title must be at least 5 characters"],
      maxLength: [200, "Title cannot exceed 200 characters"],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: [300, "Subtitle cannot exceed 300 characters"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxLength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      default: "",
    },
    // Media
    featureImage: {
      type: String,
      trim: true,
    },
    imageAlt: {
      type: String,
      default: "Article feature image",
      trim: true,
      maxLength: [150, "Alt text cannot exceed 150 characters"],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    gallery: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "Gallery image",
        },
        caption: String,
      }
    ],
    // Categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Category is required"],
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      }
    ],
    // Author Information
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    authorName: {
      type: String,
      trim: true,
      default: "ANTUF Admin",
    },
    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    // Content
    sections: [SectionSchema],
    // Publication Status
    status: {
      type: String,
      enum: ["draft", "published", "archived", "scheduled"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    scheduledFor: {
      type: Date,
    },
    // Engagement Metrics
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // SEO
    metaTitle: {
      type: String,
      trim: true,
      maxLength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxLength: [160, "Meta description cannot exceed 160 characters"],
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      }
    ],
    // Features
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    // Reading Information
    readTime: {
      type: Number, // in minutes
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    contentLanguage: {
      type: String,
      default: "ne", // Nepali by default
      enum: ["ne", "en", "hi"],
    },
    // Legacy/Deprecated (kept for backward compatibility)
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ArticlesSchema.index({
  title: "text",
  subtitle: "text",
  excerpt: "text",
  "sections.title": "text",
  "sections.description": "text",
  "sections.lectures.title": "text",
  "sections.lectures.content": "text",
}, {
  weights: {
    title: 10,
    subtitle: 5,
    "sections.title": 3,
    "sections.lectures.title": 2,
  },
  default_language: "none", // Use language-agnostic text search
  language_override: "textSearchLanguage" // Use a different field name for language override
});

ArticlesSchema.index({ category: 1, status: 1, publishedAt: -1 });
ArticlesSchema.index({ author: 1, status: 1 });
ArticlesSchema.index({ slug: 1, status: 1 });
ArticlesSchema.index({ isFeatured: 1, publishedAt: -1 });
ArticlesSchema.index({ tags: 1 });

// Virtuals
ArticlesSchema.virtual("sectionCount").get(function() {
  return this.sections ? this.sections.length : 0;
});

ArticlesSchema.virtual("totalLectures").get(function() {
  if (!this.sections) return 0;
  return this.sections.reduce((total, section) => {
    return total + (section.lectures ? section.lectures.length : 0);
  }, 0);
});

ArticlesSchema.virtual("isPublished").get(function() {
  return this.status === "published" && this.publishedAt && this.publishedAt <= new Date();
});

// Pre-save middleware
ArticlesSchema.pre("save", function(next) {
  // Auto-set publishedAt when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate read time based on content
  if (this.sections && this.sections.length > 0) {
    let totalWords = 0;
    this.sections.forEach(section => {
      if (section.lectures) {
        section.lectures.forEach(lecture => {
          if (lecture.content) {
            totalWords += lecture.content.split(/\s+/).length;
          }
        });
      }
    });
    // Average reading speed: 200 words per minute
    this.readTime = Math.ceil(totalWords / 200);
  }
  
  next();
});

// Static methods
ArticlesSchema.statics.findPublished = function() {
  return this.find({
    status: "published",
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

ArticlesSchema.statics.findFeatured = function(limit = 5) {
  return this.find({
    status: "published",
    isFeatured: true,
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

ArticlesSchema.statics.incrementViewCount = function(articleId) {
  return this.findByIdAndUpdate(
    articleId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

// Instance methods
ArticlesSchema.methods.publish = function() {
  this.status = "published";
  if (!this.publishedAt) {
    this.publishedAt = new Date();
  }
  return this.save();
};

ArticlesSchema.methods.unpublish = function() {
  this.status = "draft";
  return this.save();
};

ArticlesSchema.methods.archive = function() {
  this.status = "archived";
  return this.save();
};

export default (mongoose.models.Articles ||
  mongoose.model("Articles", ArticlesSchema)) as mongoose.Model<any>;
