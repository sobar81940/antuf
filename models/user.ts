import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: String,
      default: "https://placehold.co/600x400",
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github", "facebook", "linkedin"],
      default: "credentials",
    },
    organization: {
      type: String,
    },
    professionalAssociation: {
      type: String,
      trim: true,
      default: "",
    },
    committeeLevel: {
      type: String,
      enum: ["central", "provincial", "district", "institutional", "women", ""],
      default: "",
    },
    committeeName: {
      type: String,
      trim: true,
      default: "",
    },
    committeeLocation: {
      type: String,
      trim: true,
      default: "",
    },
    committeePosition: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Basic Profile Fields
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    // Legacy address fields (kept for backward compatibility)
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    province: {
      type: String,
      trim: true,
    },
    municipality: {
      type: String,
      trim: true,
    },
    wardNo: {
      type: String,
      trim: true,
    },
    // Permanent Address Fields (legacy)
    permanentAddress: {
      type: String,
      trim: true,
    },
    permanentCity: {
      type: String,
      trim: true,
    },
    permanentDistrict: {
      type: String,
      trim: true,
    },
    permanentMunicipality: {
      type: String,
      trim: true,
    },
    permanentProvince: {
      type: String,
      trim: true,
    },
    permanentWardNo: {
      type: String,
      trim: true,
    },
    // Temporary Address Fields (legacy)
    temporaryAddress: {
      type: String,
      trim: true,
    },
    temporaryCity: {
      type: String,
      trim: true,
    },
    temporaryDistrict: {
      type: String,
      trim: true,
    },
    temporaryMunicipality: {
      type: String,
      trim: true,
    },
    temporaryProvince: {
      type: String,
      trim: true,
    },
    temporaryWardNo: {
      type: String,
      trim: true,
    },
    // New Structured Addresses Array
    addresses: [
      {
        type: {
          type: String,
          enum: ["permanent", "temporary", "office", "other"],
          default: "permanent",
        },
        province: {
          type: String,
          trim: true,
        },
        district: {
          type: String,
          trim: true,
        },
        municipality: {
          type: String,
          trim: true,
        },
        wardNo: {
          type: String,
          trim: true,
        },
        tole: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        country: {
          type: String,
          trim: true,
        },
        zipCode: {
          type: String,
          trim: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Legacy permanentAddresses (kept for backward compatibility)
    permanentAddresses: [
      {
        addressType: {
          type: String,
          enum: ["permanent", "temporary", "office", "other"],
          default: "permanent",
        },
        province: {
          type: String,
          trim: true,
        },
        district: {
          type: String,
          trim: true,
        },
        municipality: {
          type: String,
          trim: true,
        },
        ward: {
          type: String,
          trim: true,
        },
        streetAddress: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        zipCode: {
          type: String,
          trim: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Citizenship Information (Structured)
    citizenship: {
      number: {
        type: String,
        trim: true,
      },
      issuedDistrict: {
        type: String,
        trim: true,
      },
      issuedDate: {
        type: String,
        trim: true,
      },
      frontImage: {
        type: String,
      },
      backImage: {
        type: String,
      },
    },
    // Legacy citizenship fields (kept for backward compatibility)
    citizenshipNumber: {
      type: String,
      trim: true,
    },
    citizenshipFront: {
      type: String,
    },
    citizenshipBack: {
      type: String,
    },
    // Family Information
    motherName: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    grandfatherName: {
      type: String,
      trim: true,
    },
    spouseName: {
      type: String,
      trim: true,
    },
    // Personal Information
    nameEnglish: {
      type: String,
      trim: true,
    },
    nameNepali: {
      type: String,
      trim: true,
    },
    dobNepali: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    // Professional Information
    occupation: {
      type: String,
      trim: true,
    },
    workplace: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    // Organization/Union Information
    unionName: {
      type: String,
      trim: true,
    },
    membershipNumber: {
      type: String,
      trim: true,
    },
    joinDate: {
      type: Date,
    },
    recommendations: {
      type: String,
      trim: true,
    },
    // Skills and Interests
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    // Emergency Contacts (Structured)
    emergencyContacts: [
      {
        name: {
          type: String,
          trim: true,
        },
        relationship: {
          type: String,
          trim: true,
        },
        phone: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Legacy emergency contact fields (kept for backward compatibility)
    emergencyContact: {
      type: String,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      trim: true,
    },
    // Account Verification and Tracking
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLogin: {
      type: Date,
    },
    lastLoginIP: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subscription: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

export default (mongoose.models.User || mongoose.model("User", UserSchema)) as mongoose.Model<any>;