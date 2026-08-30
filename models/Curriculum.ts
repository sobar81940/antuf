import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    idindex: {
      type: String,
    },
    lectures: [
      {
        idindex: {
          type: String,
        },
        title: {
          type: String,
          required: true,
        },
        slug: {
          type: String,
          default: "",
        },
        content: {
          type: String,
          default: "",
        },
        videourl: {
          type: String,
          default: "",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CurriculumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    sections: [SectionSchema],
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Curriculum ||
  mongoose.model("Curriculum", CurriculumSchema)) as mongoose.Model<any>;
