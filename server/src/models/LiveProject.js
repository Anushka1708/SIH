import mongoose from "mongoose";

/**
 * One checkpoint in a live project. This is the mechanism that closes the
 * loop described in the USP: an industry problem statement -> routed to a
 * faculty mentor -> broken into milestones -> each milestone, once
 * faculty-verified, becomes evidence that updates the student's
 * StudentProfile.skills (see LiveProject.skillsAwarded + the
 * /api/projects/:id/milestones/:milestoneId/verify controller Dev 2 will write).
 */
const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submitted", "completed"],
      default: "pending",
    },
    studentNotes: { type: String }, // student's submission/update
    facultyFeedback: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // faculty user
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

/**
 * Skill + level to grant a student's StudentProfile.skills entry when this
 * project (or a specific milestone) is marked completed. evidenceType on
 * the resulting StudentProfile skill entry should be set to "project".
 */
const skillAwardSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    level: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const liveProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // company user who submitted the problem statement
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // faculty mentor routing this to students
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    milestones: [milestoneSchema],
    skillsAwarded: [skillAwardSchema],

    status: {
      type: String,
      enum: ["open", "assigned", "in-progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

liveProjectSchema.index({ postedBy: 1, status: 1 });
liveProjectSchema.index({ assignedFaculty: 1 });
liveProjectSchema.index({ assignedStudents: 1 });

export default mongoose.model("LiveProject", liveProjectSchema);