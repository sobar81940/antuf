import mongoose from "mongoose";

const CommitteeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Committee name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      trim: true,
      default: "",
    },
    // Maps to User.committeeLevel for preset committees ("" = custom committee)
    type: {
      type: String,
      enum: ["central", "provincial", "district", "institutional", "women", ""],
      default: "",
    },
    // Optional: for provincial and district committees
    provinceName: {
      type: String,
      trim: true,
      default: "",
    },
    provinceNameEn: {
      type: String,
      trim: true,
      default: "",
    },
    districtName: {
      type: String,
      trim: true,
      default: "",
    },
    districtNameEn: {
      type: String,
      trim: true,
      default: "",
    },
    association: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalAssociation",
      required: true,
      index: true,
    },
    // Members assigned to this committee (source of truth for membership)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberDetails: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        position: {
          type: String,
          enum: ["अध्यक्ष", "उपाध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"],
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// One committee per association must have a unique name
CommitteeSchema.index({ association: 1, name: 1 }, { unique: true });

const cachedCommitteeModel = mongoose.models.Committee as mongoose.Model<any> | undefined;
if (
  cachedCommitteeModel &&
  (!cachedCommitteeModel.schema.path("type")?.["enumValues"]?.includes("women") ||
    !cachedCommitteeModel.schema.path("memberDetails"))
) {
  delete mongoose.models.Committee;
}

export default (mongoose.models.Committee || mongoose.model("Committee", CommitteeSchema)) as mongoose.Model<any>;
