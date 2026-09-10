import mongoose from "mongoose";

/**
 * Canonical skill taxonomy. Every skill referenced anywhere in the system
 * (StudentProfile.skills, Opportunity.requiredSkills, LiveProject.requiredSkills)
 * points to a document here — this is what keeps the gap engine consistent
 * (comparing "React" to "React", not "React" to "ReactJS").
 *
 * `ncrfCode` is optional but worth populating where possible: aligning to
 * India's National Credit Framework / NSQF codes is what would let this
 * taxonomy interoperate with Skill India Digital Hub data later.
 */
const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      enum: ["technical", "soft", "domain", "tool"],
      required: true,
    },
    aliases: [{ type: String, trim: true }], // e.g. "ReactJS", "React.js" both resolve to "React"
    relatedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    ncrfCode: { type: String }, // optional NSQF/NCrF alignment code
    description: { type: String },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1 });

export default mongoose.model("Skill", skillSchema);