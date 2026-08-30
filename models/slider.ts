import mongoose from "mongoose";
const sliderSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  // offer: {
  //   type: String,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
  },
  sub_title: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  button_link: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default (mongoose.models.Slider ||
  mongoose.model('Slider', sliderSchema)) as mongoose.Model<any>;