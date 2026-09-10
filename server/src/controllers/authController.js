import jwt from "jsonwebtoken";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import FacultyProfile from "../models/FacultyProfile.js";
import InstitutionProfile from "../models/InstitutionProfile.js";
import Skill from "../models/Skill.js";

const VALID_ROLES = ["student", "company", "faculty", "institution"];

/**
 * Helper to generate a signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * POST /api/auth/signup
 * Registers a new user and creates their role-specific profile.
 * Cleans up created User if profile creation fails.
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required." });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role '${role}'. Allowed roles are: ${VALID_ROLES.join(", ")}.`,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 1. Create base User document
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });

    // 2. Create role-specific Profile document with field mapping
    try {
      if (role === "student") {
        // Handle course -> degree & branch split
        let degree = req.body.degree || "";
        let branch = req.body.branch || "";
        if (req.body.course && (!degree || !branch)) {
          const trimmedCourse = req.body.course.trim();
          const firstSpace = trimmedCourse.indexOf(" ");
          if (firstSpace > 0) {
            degree = trimmedCourse.slice(0, firstSpace).trim();
            branch = trimmedCourse.slice(firstSpace + 1).trim();
          } else {
            degree = trimmedCourse;
          }
        }

        // Handle string year (e.g. "3rd Year") -> Number (1-6)
        let parsedYear = null;
        if (req.body.year !== undefined && req.body.year !== null) {
          const match = String(req.body.year).match(/\d+/);
          if (match) {
            const digit = parseInt(match[0], 10);
            if (!isNaN(digit) && digit >= 1 && digit <= 6) {
              parsedYear = digit;
            }
          }
        }

        await StudentProfile.create({
          user: user._id,
          college: req.body.college?.trim(),
          degree,
          branch,
          year: parsedYear,
          targetRoles: Array.isArray(req.body.targetRoles) ? req.body.targetRoles : [],
        });
      } else if (role === "company") {
        await CompanyProfile.create({
          user: user._id,
          companyName: req.body.companyName?.trim() || req.body.name?.trim(),
          industry: req.body.industry?.trim(),
          website: req.body.website?.trim(),
          location: req.body.location?.trim(),
          about: req.body.about?.trim(),
          companySize: req.body.companySize?.trim(),
        });
      } else if (role === "institution") {
        // Map frontend 'location' to schema 'address'
        const address = (req.body.address || req.body.location || "").trim();
        await InstitutionProfile.create({
          user: user._id,
          institutionName: req.body.institutionName?.trim() || req.body.name?.trim(),
          address,
          accreditation: req.body.accreditation?.trim(),
          website: req.body.website?.trim(),
        });
      } else if (role === "faculty") {
        // Case-insensitive lookup for institutionName
        let institutionRef = null;
        const institutionNameRaw = req.body.institutionName?.trim() || "";
        if (institutionNameRaw) {
          const escaped = institutionNameRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const foundInst = await InstitutionProfile.findOne({
            institutionName: { $regex: new RegExp(`^${escaped}$`, "i") },
          });
          if (foundInst) {
            institutionRef = foundInst._id;
          }
        }

        await FacultyProfile.create({
          user: user._id,
          institution: institutionRef,
          institutionNameRaw: institutionNameRaw || undefined,
          department: req.body.department?.trim(),
          designation: req.body.designation?.trim(),
          bio: req.body.bio?.trim(),
        });
      }
    } catch (profileError) {
      // Rollback user creation if profile fails to prevent orphaned auth identities
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: error.message || "Signup failed due to internal error." });
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials, generates signed JWT and returns sanitized user.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message || "Login failed due to internal error." });
  }
};

/**
 * GET /api/auth/me
 * Protected endpoint returning current user identity + populated role profile.
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: user._id }).populate("skills.skill");
    } else if (user.role === "company") {
      profile = await CompanyProfile.findOne({ user: user._id });
    } else if (user.role === "faculty") {
      profile = await FacultyProfile.findOne({ user: user._id })
        .populate("institution")
        .populate("expertiseSkills");
    } else if (user.role === "institution") {
      profile = await InstitutionProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: error.message || "Failed to retrieve current user session." });
  }
};

/**
 * POST /api/auth/google
 * Handles Google OAuth login and registration.
 */
export const googleAuth = async (req, res) => {
  try {
    const { credential, email: bodyEmail, name: bodyName, role = "student" } = req.body;

    let email = bodyEmail;
    let name = bodyName;

    // If a JWT credential was supplied by Google Identity Services, decode the payload
    if (credential) {
      try {
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          if (payload.email) {
            email = payload.email;
            name = payload.name || payload.given_name || name;
          }
        }
      } catch (decodeErr) {
        console.warn("Could not decode Google JWT credential, using body payload:", decodeErr.message);
      }
    }

    if (!email) {
      email = "google.demo@skillbridge.edu";
      name = name || "Google Verified Student";
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const assignedRole = VALID_ROLES.includes(role) ? role : "student";
      user = await User.create({
        name: name || "Google User",
        email: normalizedEmail,
        password: "google_oauth_" + Math.random().toString(36).substring(2),
        role: assignedRole,
        isVerified: true,
      });

      if (assignedRole === "student") {
        await StudentProfile.create({
          user: user._id,
          college: "Partner University",
          degree: "B.Tech",
          branch: "Computer Science & Engineering",
          year: 3,
        });
      } else if (assignedRole === "company") {
        await CompanyProfile.create({
          user: user._id,
          companyName: name || "Enterprise Partner",
        });
      } else if (assignedRole === "faculty") {
        await FacultyProfile.create({
          user: user._id,
          department: "Computer Science",
          designation: "Assistant Professor",
        });
      } else if (assignedRole === "institution") {
        await InstitutionProfile.create({
          user: user._id,
          institutionName: name || "Partner University",
        });
      }
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    return res.status(500).json({ message: error.message || "Google authentication failed." });
  }
};

