import mongoose from "mongoose";

const institutionProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    institutionName: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    accreditation: { type: String, trim: true }, // e.g. "NAAC A++", "NBA"
    website: { type: String },
    totalStudents: { type: Number, default: 0 },
    totalFaculty: { type: Number, default: 0 },
  },
  { timestamps: true }
);


export default mongoose.model("InstitutionProfile", institutionProfileSchema);