import mongoose from "mongoose";

const facultyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    institution: { type: mongoose.Schema.Types.ObjectId, ref: "InstitutionProfile" },
    department: { type: String, trim: true },
    designation: { type: String, trim: true }, // e.g. "Assistant Professor"
    expertiseSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    bio: { type: String },

    // Faculty-industry collaboration visibility (mentorship & FDP tracking)
    mentorshipCount: { type: Number, default: 0 }, // denormalized counter, kept in sync by controllers
  },
  { timestamps: true }
);


export default mongoose.model("FacultyProfile", facultyProfileSchema);