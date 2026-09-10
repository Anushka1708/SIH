import mongoose from "mongoose";

const companyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    companyName: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    logoUrl: { type: String },
    location: { type: String, trim: true },
    about: { type: String },
    companySize: { type: String }, // e.g. "1-10", "50-200"
  },
  { timestamps: true }
);


export default mongoose.model("CompanyProfile", companyProfileSchema);