import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['शैक्षिक / Education', 'सामाजिक / Social', 'स्वास्थ्य / Health', 'जागरुकता / Awareness', 'अन्य / Other'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming', 'planned'],
    default: 'planned',
  },
  image: {
    type: String,
  },
  details: {
    type: String,
  },
  location: {
    type: String,
  },
  organizer: {
    type: String,
  },
}, { timestamps: true });

export default (mongoose.models.Activity ||
  mongoose.model('Activity', activitySchema)) as mongoose.Model<any>;
