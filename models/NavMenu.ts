import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  label: { type: String, required: true },
  labelEn: { type: String, default: "" },
  path: { type: String, required: true },
}, { _id: false });

const navMenuSchema = new mongoose.Schema({
  label:    { type: String, required: true },
  labelEn:  { type: String, default: "" },
  path:     { type: String, default: "" },
  children: { type: [childSchema], default: [] },
  order:    { type: Number, default: 0 },
  isVisible:{ type: Boolean, default: true },
}, { timestamps: true });

export default (mongoose.models.NavMenu || mongoose.model("NavMenu", navMenuSchema)) as mongoose.Model<any>;
