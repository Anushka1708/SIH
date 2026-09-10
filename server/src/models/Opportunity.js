import mongoose from "mongoose";

/**
 * A skill requirement on a posting. minLevel (0-100) is what Dev 2's
 * matching engine (/api/matching) compares against a candidate's
 * StudentProfile.skills[].level to compute the gap vector.
 */
const requiredSkillSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    minLevel: { type: Number, min: 0, max: 100, default: 50 },
    weight: { type: Number, min: 0, max: 1, default: 1 }, // importance in the match score, e.g. "must-have" vs "nice-to-have"
  },
  { _id: false }
);

/**
 * Embedded for MVP speed (hackathon scope). If application volume/tracking
 * needs grow post-hackathon, this can be split into its own `Application`
 * collection without changing the rest of the schema.
 */
const applicantSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "hired", "rejected"],
      default: "applied",
    },
    matchScore: { type: Number, min: 0, max: 100 }, // filled in by the matching engine at apply-time
    matchReasoning: { type: String }, // explainable text, e.g. "Strong in React & Node.js, gap in System Design"
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const opportunitySchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // company user
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["internship", "job", "project"],
      required: true,
    },
    description: { type: String, required: true },
    requiredSkills: [requiredSkillSchema],

    location: { type: String, trim: true },
    isRemote: { type: Boolean, default: false },
    stipend: { type: String }, // kept as string to allow "₹15k/month" style display values, matches frontend mock format
    deadline: { type: Date },

    status: { type: String, enum: ["open", "closed"], default: "open" },
    applicants: [applicantSchema],
  },
  { timestamps: true }
);

opportunitySchema.index({ postedBy: 1, status: 1 });
opportunitySchema.index({ "requiredSkills.skill": 1 });

export default mongoose.model("Opportunity", opportunitySchema);