import Skill from "../models/Skill.js";

const VALID_CATEGORIES = ["technical", "soft", "domain", "tool"];

export const getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        });
      }
      filter.category = category;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { aliases: regex }];
    }

    const skills = await Skill.find(filter)
      .populate("relatedSkills", "name category")
      .sort({ name: 1 });

    res.json({ count: skills.length, skills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "relatedSkills",
      "name category"
    );
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: "Invalid skill id" });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, aliases, relatedSkills, ncrfCode, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "name and category are required" });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    const existing = await Skill.findOne({
      name: new RegExp(`^${name.trim()}$`, "i"),
    });
    if (existing) {
      return res.status(409).json({ error: `Skill "${name}" already exists` });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      aliases,
      relatedSkills,
      ncrfCode,
      description,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { category } = req.body;
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: "Invalid skill id" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    await Skill.updateMany(
      { relatedSkills: skill._id },
      { $pull: { relatedSkills: skill._id } }
    );

    await skill.deleteOne();
    res.json({ message: `Skill "${skill.name}" deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
