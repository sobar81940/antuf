import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required."],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters."],
    },

    url: {
      type: String,
      required: [true, "Video URL is required."],
      trim: true,
      validate: {
        validator: function (v) {
          return /(youtube\.com|youtu\.be)/.test(v);
        },
        message: (props) => `${props.value} is not a valid YouTube URL!`,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Delete the old model if it exists to force fresh schema
if (mongoose.models.Video) {
  delete mongoose.models.Video;
}

export default (mongoose.model("Video", VideoSchema)) as mongoose.Model<any>;
