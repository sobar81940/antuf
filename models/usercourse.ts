import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema(
  {
    // 'user_id' field to reference the user who enrolled in the course
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 'course_id' field to reference the course that the user enrolled in
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurriculumCourse",
      required: true,
    },

    // 'purchase_date' field to record when the user purchased or enrolled in the course
    purchase_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.UserCourse ||
  mongoose.model("UserCourse", userCourseSchema)) as mongoose.Model<any>;
