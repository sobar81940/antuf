import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
      index: true,
    },
    yearNumeric: {
      type: Number,
      required: [true, "Numeric year is required for sorting"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    titleEn: {
      type: String,
      trim: true,
      maxLength: [200, "English title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [10, "Description must be at least 10 characters"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxLength: [2000, "English description cannot exceed 2000 characters"],
    },
    icon: {
      type: String,
      required: [true, "Icon name is required"],
      trim: true,
      enum: [
        "Flag",
        "People",
        "Gavel",
        "TrendingUp",
        "EmojiEvents",
        "MenuBook",
        "School",
        "Business",
        "VolunteerActivism",
        "Public",
        "Diversity",
        "Handshake",
        "AccountBalance",
        "Build",
        "LocalHospital",
        "Eco",
        "Science",
        "Sports",
        "MusicNote",
        "TheaterComedy",
        "Custom"
      ],
      default: "Flag",
    },
    customIconUrl: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      enum: ["primary", "secondary", "success", "error", "warning", "info"],
      default: "primary",
    },
    image: {
      type: String,
      trim: true,
    },
    imageAlt: {
      type: String,
      trim: true,
      maxLength: [150, "Alt text cannot exceed 150 characters"],
    },
    orderIndex: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      }
    ],
    metadata: {
      location: {
        type: String,
        trim: true,
      },
      participants: {
        type: Number,
        min: 0,
      },
      significance: {
        type: String,
        enum: ["local", "national", "international"],
        default: "national",
      },
      relatedLinks: [
        {
          label: {
            type: String,
            trim: true,
          },
          url: {
            type: String,
            trim: true,
            validate: {
              validator: function(v: string) {
                if (!v) return true;
                return /^https?:\/\/.+/.test(v);
              },
              message: "Please provide a valid URL",
            },
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MilestoneSchema.index({ yearNumeric: -1, orderIndex: 1 });
MilestoneSchema.index({ isPublished: 1, yearNumeric: -1 });
MilestoneSchema.index({ isFeatured: 1, yearNumeric: -1 });
MilestoneSchema.index({ "metadata.significance": 1 });
MilestoneSchema.index({ tags: 1 });

MilestoneSchema.virtual("formattedYear").get(function() {
  return this.year;
});

MilestoneSchema.virtual("hasEnglishContent").get(function() {
  return !!(this.titleEn || this.descriptionEn);
});

MilestoneSchema.pre("save", function(next) {
  if (this.isModified("yearNumeric") && !this.year) {
    this.year = this.yearNumeric.toString();
  }
  next();
});

MilestoneSchema.statics.findPublished = function() {
  return this.find({
    isPublished: true,
  }).sort({ yearNumeric: -1, orderIndex: 1 });
};

MilestoneSchema.statics.findFeatured = function(limit = 10) {
  return this.find({
    isPublished: true,
    isFeatured: true,
  })
    .sort({ yearNumeric: -1, orderIndex: 1 })
    .limit(limit);
};

MilestoneSchema.statics.findByYearRange = function(startYear: number, endYear: number) {
  return this.find({
    isPublished: true,
    yearNumeric: { $gte: startYear, $lte: endYear },
  }).sort({ yearNumeric: -1, orderIndex: 1 });
};

export default (mongoose.models.Milestone ||
  mongoose.model("Milestone", MilestoneSchema)) as mongoose.Model<any>;