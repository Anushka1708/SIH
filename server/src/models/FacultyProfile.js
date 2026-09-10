import mongoose from "mongoose";

const facultyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    institution: { type: mongoose.Schema.Types.ObjectId, ref: "InstitutionProfile" },
    institutionNameRaw: { type: String, trim: true },
    department: { type: String, trim: true },
    designation: { type: String, trim: true }, // e.g. "Assistant Professor"
    expertiseSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    bio: { type: String },

    // Faculty-industry collaboration visibility (mentorship & FDP tracking)
    mentorshipCount: { type: Number, default: 0 }, // denormalized counter, kept in sync by controllers

    // Assessments created by faculty
    assessments: [
      {
        title: { type: String, required: true },
        course: { type: String, default: "General Computer Science" },
        totalQuestions: { type: Number, default: 5 },
        dueDate: { type: String, default: "Open" },
        submissionsCount: { type: Number, default: 0 },
        pendingCount: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 },
        status: { type: String, enum: ["Active", "Draft", "Archived"], default: "Active" },
        questions: [
          {
            id: Number,
            question: String,
            options: [String],
            correctIndex: Number,
            explanation: String,
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Faculty Upskilling & Professional Educator Badges
    upskillingModules: [
      {
        moduleId: String,
        title: String,
        category: String,
        progress: { type: Number, default: 0 }, // 0-100%
        completed: { type: Boolean, default: false },
        score: { type: Number, default: 0 },
        badgeAwarded: { type: Boolean, default: false },
        badgeTitle: String,
        completedAt: Date,
      },
    ],
    upskillingBadges: [
      {
        id: String,
        title: String,
        category: String,
        issuedBy: { type: String, default: "SkillBridge AI Faculty Academy" },
        awardedAt: { type: Date, default: Date.now },
        badgeColor: String,
      },
    ],

    // Faculty AI CV / Resume Analysis
    cvFileName: { type: String },
    cvUrl: { type: String },
    cvRawText: { type: String },
    cvAnalysis: {
      overallScore: { type: Number, default: 0 },
      summary: { type: String },
      qualifications: [{ type: String }],
      teachingExperience: [{ type: String }],
      researchPublications: [{ type: String }],
      certifications: [{ type: String }],
      expertiseDomains: [{ type: String }],
      recommendations: [{ type: String }],
      analyzedAt: { type: Date },
    },
  },
  { timestamps: true }
);


export default mongoose.model("FacultyProfile", facultyProfileSchema);