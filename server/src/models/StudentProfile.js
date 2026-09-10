import mongoose from "mongoose";

/**
 * One embedded skill entry on a student's profile.
 * `level` is 0-100 and is meant to be EVIDENCE-DERIVED, not self-typed —
 * controllers should only raise it via an assessment score, a verified
 * certificate, or a faculty/mentor sign-off (see evidenceType).
 * This array IS the "skill vector" the gap engine (Dev 2) compares
 * against an Opportunity's requiredSkills.
 */
const skillEntrySchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    level: { type: Number, min: 0, max: 100, default: 0 },
    verified: { type: Boolean, default: false },
    evidenceType: {
      type: String,
      enum: ["assessment", "certificate", "project", "faculty-signoff", "self-reported"],
      default: "self-reported",
    },
    evidenceRef: { type: String }, // e.g. certificate URL or LiveProject id as string
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { _id: false }
);

const portfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["project", "certificate", "achievement"], required: true },
    description: { type: String },
    link: { type: String },
    issuedBy: { type: String }, // e.g. course provider, hackathon, faculty name
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const roadmapItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    relatedSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    done: { type: Boolean, default: false },
    youtubeVideoId: { type: String }, // e.g. "w7ejDZ8SWv8"
    youtubeTitle: { type: String },   // e.g. "React JS Crash Course - Traversy Media"
    youtubeChannel: { type: String }, // e.g. "Traversy Media"
  },
  { _id: true }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    college: { type: String, trim: true },
    degree: { type: String, trim: true },
    branch: { type: String, trim: true },
    year: { type: Number, min: 1, max: 6 },
    resumeUrl: { type: String },
    resumeFileName: { type: String },
    resumeRawText: { type: String },
    parsedResumeData: { type: mongoose.Schema.Types.Mixed },
    bio: { type: String },
    contactNumber: { type: String, trim: true },

    skills: [skillEntrySchema],
    targetRoles: [{ type: String, trim: true }], // e.g. "Frontend Developer" — used to pick which Opportunity/role to gap-check against

    portfolio: [portfolioItemSchema],
    roadmap: [roadmapItemSchema],

    profileCompletion: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

// One student profile per user

export default mongoose.model("StudentProfile", studentProfileSchema);