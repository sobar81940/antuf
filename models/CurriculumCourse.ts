// Import mongoose library for schema creation and MongoDB interaction
import mongoose from "mongoose";

// Define the SectionSchema for sections within a course (e.g., for lectures)
const SectionSchema = new mongoose.Schema(
  {
    // 'title' field for the section, which is required
    title: {
      type: String, // The field type is a String
      required: true, // The field is required, cannot be left empty
    },

    // 'idindex' field for unique identification of each section (optional)
    idindex: {
      type: String, // The field type is a String
    },

    // 'lectures' field to store an array of lecture objects within each section
    lectures: [
      {
        // 'idindex' field for unique identification of each lecture (optional)
        idindex: {
          type: String, // The field type is a String
        },

        // 'title' field for the title of the lecture, which is required
        title: {
          type: String, // The field type is a String
          required: true, // The field is required, cannot be left empty
        },

        // 'slug' field for creating a URL-friendly identifier (optional)
        slug: {
          type: String, // The field type is a String
          default: "", // Default value is an empty string
        },

        // 'videourl' field to store the URL for the lecture's video (optional)
        videourl: {
          type: String, // The field type is a String
          default: "", // Default value is an empty string
        },

        // 'date' field to store the date the lecture was created (default to current date)
        date: {
          type: Date, // The field type is a Date
          default: Date.now, // Default value is the current date and time
        },
      },
    ], // End of lectures array
  },
  { timestamps: true } // Add createdAt and updatedAt fields automatically
);

// Define the CurriculumCourseSchema for the overall course
const CurriculumCourseSchema = new mongoose.Schema(
  {
    // 'title' field for the course, which is required
    title: {
      type: String, // The field type is a String
      required: true, // The field is required, cannot be left empty
    },

    // 'slug' field for a unique and URL-friendly identifier for the course, which is required
    slug: {
      type: String, // The field type is a String
      unique: true, // Ensures each course has a unique slug value
      required: true, // The field is required, cannot be left empty
    },

    // 'about' field to describe the course (optional)
    about: {
      type: String, // The field type is a String
    },

    // 'description' field to provide a detailed description of the course (optional)
    description: {
      type: String, // The field type is a String
    },

    // 'imageUrl' field to store a URL to an image representing the course (optional)
    imageUrl: {
      type: String, // The field type is a String
    },

    // 'level' field to define the difficulty level of the course (optional)
    level: {
      type: String, // The field type is a String
    },

    // 'videoUrl' field to store a URL to a course introductory video (optional)
    videoUrl: {
      type: String, // The field type is a String
    },

    // 'price' field to store the course price
    price: {
      type: Number, // The field type is a Number
      required: true, // The field is required
      default: 0, // Default price is 0
      min: 0, // Price cannot be negative
    },

    // 'sections' field to store an array of sections (each section is a SectionSchema)
    sections: [SectionSchema], // Embeds the SectionSchema into the course schema
  },
  { timestamps: true } // Add createdAt and updatedAt fields automatically
);

// Export the CurriculumCourse model, or use the existing model if already created
export default (mongoose.models.CurriculumCourse ||
  mongoose.model("CurriculumCourse", CurriculumCourseSchema)) as mongoose.Model<any>;
