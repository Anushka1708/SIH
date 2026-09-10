import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import StudentProfile from "../models/StudentProfile.js";
import Skill from "../models/Skill.js";

// Curated comprehensive fallback question banks
const FALLBACK_QUESTION_BANKS = {
  react: [
    {
      id: 1,
      question: "What is the primary difference between useEffect and useLayoutEffect in React?",
      options: [
        "useLayoutEffect runs asynchronously after paint, while useEffect runs synchronously",
        "useLayoutEffect runs synchronously immediately after DOM mutations before browser paint",
        "useEffect is only used for server-side rendering",
        "There is no functional difference between them",
      ],
      correctIndex: 1,
      explanation: "useLayoutEffect runs synchronously immediately after all DOM mutations, blocking visual paint to prevent layout flickers.",
    },
    {
      id: 2,
      question: "Why should keys be unique, stable identifiers among sibling items in a React list?",
      options: [
        "To enforce CSS grid alignment in the DOM tree",
        "To enable React's reconciliation diffing algorithm to identify which items have changed, moved, or been deleted",
        "To register native event listeners on each item",
        "To trigger automatic server-side caching",
      ],
      correctIndex: 1,
      explanation: "React relies on stable keys to match children in the original tree with children in the subsequent tree during reconciliation.",
    },
    {
      id: 3,
      question: "Which hook should you use to preserve a mutable value across renders without triggering a re-render when mutated?",
      options: ["useState", "useMemo", "useRef", "useCallback"],
      correctIndex: 2,
      explanation: "useRef returns a mutable ref object whose .current property persists across renders without causing a re-render when modified.",
    },
    {
      id: 4,
      question: "What is the React 18 Concurrent feature 'useTransition' used for?",
      options: [
        "To animate CSS transitions seamlessly",
        "To mark state updates as non-urgent transitions that can be interrupted by urgent user inputs",
        "To transition state between different browser tabs",
        "To convert client components into server components",
      ],
      correctIndex: 1,
      explanation: "useTransition allows developers to mark state transitions as non-blocking, keeping the interface responsive during heavy UI rendering.",
    },
    {
      id: 5,
      question: "In React context API, what happens to consumer components when the context provider's value object reference changes?",
      options: [
        "Only the nearest child re-renders",
        "All components consuming that context re-render, bypassing React.memo optimization",
        "React discards all children and unmounts them",
        "No re-render happens unless props change",
      ],
      correctIndex: 1,
      explanation: "All consumers re-render whenever the Provider's value reference changes. Memoizing the value object with useMemo avoids unnecessary re-renders.",
    },
  ],
  node: [
    {
      id: 1,
      question: "How does Node.js handle asynchronous non-blocking I/O operations without multi-threading JavaScript execution?",
      options: [
        "By spawning an OS thread for each incoming network socket",
        "Through the libuv event loop and an internal thread pool for file/DNS operations",
        "By compiling all JavaScript into synchronous assembly instructions",
        "Through browser Web Workers running in the background",
      ],
      correctIndex: 1,
      explanation: "Node.js relies on libuv which provides the event loop and thread pool for delegating asynchronous operations to the operating system.",
    },
    {
      id: 2,
      question: "What is the purpose of process.nextTick() compared to setImmediate() in the Node.js event loop?",
      options: [
        "setImmediate runs before the current operation completes",
        "process.nextTick queues a microtask that executes immediately after the current phase finishes, before any new event loop phase",
        "They are identical and execute in the poll phase",
        "process.nextTick executes only after timers expire",
      ],
      correctIndex: 1,
      explanation: "process.nextTick callbacks are processed immediately following the current operation, before the event loop advances to the next phase.",
    },
    {
      id: 3,
      question: "Which core Node.js module provides Stream interfaces for efficient handling of large files and data pipelines?",
      options: ["stream", "fs-extra", "buffer-pool", "events-io"],
      correctIndex: 0,
      explanation: "The native 'stream' module provides Readable, Writable, Duplex, and Transform stream classes for memory-efficient data chunk handling.",
    },
    {
      id: 4,
      question: "What is the primary role of Express.js middleware with the signature (err, req, res, next)?",
      options: [
        "Authenticating JWT tokens",
        "Handling centralized error catching when next(err) is invoked upstream",
        "Compressing outgoing gzip payloads",
        "Routing static assets from public folders",
      ],
      correctIndex: 1,
      explanation: "A four-argument middleware function in Express is designated specifically as an error handler, triggered whenever next(err) is called.",
    },
    {
      id: 5,
      question: "Why should synchronous file operations like fs.readFileSync() be avoided in high-concurrency production Node servers?",
      options: [
        "They cause memory buffer overflows",
        "They block the single JavaScript main thread, preventing the server from handling other concurrent client requests",
        "They are deprecated in modern ECMAScript",
        "They disable TLS socket encryption",
      ],
      correctIndex: 1,
      explanation: "Synchronous calls block the entire event loop thread until file I/O finishes, drastically reducing server throughput.",
    },
  ],
  python: [
    {
      id: 1,
      question: "What does Python's Global Interpreter Lock (GIL) enforce in CPython?",
      options: [
        "Ensures Python scripts can never make multithreaded network requests",
        "Prevents multiple native threads from executing Python bytecodes simultaneously in a single process",
        "Enforces immutability on all dictionary keys",
        "Limits variable memory allocation to 4GB",
      ],
      correctIndex: 1,
      explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously in CPython.",
    },
    {
      id: 2,
      question: "What is the key difference between a Python list and a generator expression when working with large datasets?",
      options: [
        "Lists cannot be sorted",
        "Generators evaluate items lazily on-demand, consuming minimal memory, whereas lists allocate all items in memory upfront",
        "Generators only support string data types",
        "Generators cannot be iterated over in a for loop",
      ],
      correctIndex: 1,
      explanation: "Generators yield items one at a time via the iterator protocol without holding the entire collection in memory at once.",
    },
    {
      id: 3,
      question: "What is the average time complexity of item retrieval and membership testing ('x in d') in a Python dictionary?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
      correctIndex: 2,
      explanation: "Python dictionaries use optimized hash tables, resulting in average O(1) time complexity for lookup, insertion, and deletion.",
    },
    {
      id: 4,
      question: "In Python object-oriented programming, what does the '@classmethod' decorator do to its method's first parameter?",
      options: [
        "Passes the current instance ('self')",
        "Passes the class itself ('cls') instead of an instance of the class",
        "Converts the method into a static immutable function",
        "Executes the method in a separate daemon thread",
      ],
      correctIndex: 1,
      explanation: "@classmethod binds the method to the class rather than an instance, passing the class object as the first argument (cls).",
    },
    {
      id: 5,
      question: "Which mechanism allows context management and guarantees resource cleanup (e.g. closing files) in Python?",
      options: [
        "The 'with' statement implementing __enter__ and __exit__ methods",
        "The 'switch-case' block",
        "The 'finally-yield' directive",
        "Automatic garbage collector cycle callbacks",
      ],
      correctIndex: 0,
      explanation: "Context managers accessed via 'with' implement __enter__ and __exit__ dunder methods to guarantee cleanup even if exceptions occur.",
    },
  ],
  default: [
    {
      id: 1,
      question: "Which architectural pattern decouples components by communicating asynchronously via events rather than direct synchronous RPC calls?",
      options: [
        "Shared Monolithic Memory Architecture",
        "Event-Driven Microservices Architecture",
        "Tight Coupling Service Mesh",
        "Single-Threaded Polling Loop",
      ],
      correctIndex: 1,
      explanation: "Event-driven architecture decouples producers and consumers, allowing high scalability, fault tolerance, and independent service deployments.",
    },
    {
      id: 2,
      question: "What is the main advantage of using database indexing on frequently queried foreign key or filter columns?",
      options: [
        "Drastically decreases storage space on disk",
        "Reduces query execution time by eliminating the need for full table scans (O(log n) vs O(n))",
        "Guarantees automatic transactional rollback",
        "Encrypts column values at rest",
      ],
      correctIndex: 1,
      explanation: "Indexes create balanced B-Tree or Hash data structures that allow the query engine to find matching records in O(log n) time.",
    },
    {
      id: 3,
      question: "In RESTful API design, which HTTP method should be used for idempotent updates that replace the entire target resource?",
      options: ["POST", "PUT", "PATCH", "CONNECT"],
      correctIndex: 1,
      explanation: "PUT is designed to be idempotent and replaces the entire target resource with the uploaded payload.",
    },
    {
      id: 4,
      question: "What is the primary role of Continuous Integration (CI) in modern software engineering workflows?",
      options: [
        "Deploying unstable code directly to production without staging",
        "Automatically building, validating, and running automated test suites upon every code commit or pull request",
        "Eliminating the need for developer documentation",
        "Running physical hardware diagnostics",
      ],
      correctIndex: 1,
      explanation: "CI automatically builds and tests code changes frequently, detecting integration errors and regressions early.",
    },
    {
      id: 5,
      question: "What does the CAP theorem state regarding distributed data systems during a network partition (P)?",
      options: [
        "The system can achieve Consistency, Availability, and Partition tolerance simultaneously",
        "The system must choose between Consistency (returning latest data or error) and Availability (returning available data, possibly stale)",
        "Partitions never occur in cloud database clusters",
        "Network latency is guaranteed to remain below 10ms",
      ],
      correctIndex: 1,
      explanation: "When a network partition occurs in a distributed system, you must trade off between Consistency (CP) and Availability (AP).",
    },
  ],
};

/**
 * Generate 5 dynamic MCQs using Gemini AI or return fallback bank
 * POST /api/assessments/generate-quiz
 */
export const generateSkillQuiz = async (req, res) => {
  try {
    const { skillName = "Technical Competency", currentScore = 50 } = req.body;
    const cleanSkill = skillName.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const prompt = `You are a senior technical examiner and AI Faculty Mentor on SkillBridge, an accredited higher education competency platform.
Generate exactly 5 challenging, practical, multiple-choice questions (MCQs) to evaluate candidate technical competency in: "${cleanSkill}".
Target candidate competence level: ${currentScore || 50}%.

Requirements:
1. Questions should test conceptual depth, real-world edge cases, and industry best practices.
2. Each question must have exactly 4 options.
3. correctIndex must be an integer (0, 1, 2, or 3) indicating the exact correct option.
4. explanation must be a clear 1-2 sentence explanation of why the correct answer is right.

Format Output strictly as a JSON array of 5 objects matching this structure:
[
  {
    "id": 1,
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation text..."
  }
]
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith("```")) {
          text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        }

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          const validatedQuestions = parsed.slice(0, 5).map((q, idx) => ({
            id: q.id || idx + 1,
            question: q.question || `Question ${idx + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < 4
              ? q.correctIndex
              : 0,
            explanation: q.explanation || "Evaluated by SkillBridge AI Faculty Engine.",
          }));

          return res.json({
            success: true,
            source: "gemini-3.6-flash",
            skillName: cleanSkill,
            questions: validatedQuestions,
          });
        }
      } catch (geminiError) {
        console.warn("Gemini quiz generator error, falling back to curated bank:", geminiError.message);
      }
    }

    // Curated Fallback Selection
    const lower = cleanSkill.toLowerCase();
    let fallbackQuestions = FALLBACK_QUESTION_BANKS.default;
    if (lower.includes("react") || lower.includes("frontend") || lower.includes("next")) {
      fallbackQuestions = FALLBACK_QUESTION_BANKS.react;
    } else if (lower.includes("node") || lower.includes("express") || lower.includes("backend")) {
      fallbackQuestions = FALLBACK_QUESTION_BANKS.node;
    } else if (lower.includes("python") || lower.includes("django") || lower.includes("fastapi")) {
      fallbackQuestions = FALLBACK_QUESTION_BANKS.python;
    }

    return res.json({
      success: true,
      source: "curated-question-bank",
      skillName: cleanSkill,
      questions: fallbackQuestions,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return res.status(500).json({
      error: "Failed to generate assessment quiz.",
      details: error.message,
    });
  }
};

/**
 * Submit assessment quiz answers, evaluate score, and update StudentProfile.skills
 * POST /api/assessments/submit-quiz
 */
export const submitSkillQuiz = async (req, res) => {
  try {
    const {
      skillId,
      skillName = "Technical Skill",
      totalQuestions = 5,
      correctCount = 0,
      score: submittedScore,
    } = req.body;

    const studentUserId = req.user?._id;
    if (!studentUserId) {
      return res.status(401).json({ error: "Unauthorized: student identity required." });
    }

    // Calculate score percentage
    const calculatedScore =
      typeof submittedScore === "number"
        ? Math.min(100, Math.max(0, Math.round(submittedScore)))
        : Math.min(100, Math.max(0, Math.round((correctCount / (totalQuestions || 5)) * 100)));

    const isPassed = calculatedScore >= 80;

    // Find student profile
    const profile = await StudentProfile.findOne({ user: studentUserId });
    if (!profile) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    // Find skill in taxonomy if needed
    let targetSkillId = skillId;
    if (!targetSkillId || !mongoose.Types.ObjectId.isValid(targetSkillId)) {
      const skillDoc = await Skill.findOne({
        name: { $regex: new RegExp(`^${skillName.trim()}$`, "i") },
      });
      if (skillDoc) {
        targetSkillId = skillDoc._id;
      }
    }

    // Update skill entry in profile
    const existingIndex = profile.skills.findIndex(
      (s) =>
        (s.skill?._id || s.skill)?.toString() === targetSkillId?.toString() ||
        s.skill?.name?.toLowerCase() === skillName.toLowerCase()
    );

    const evidenceRef = `AI-FACULTY-QUIZ-${Date.now()}`;
    const badgeTitle = `AI-Verified ${skillName} Specialist`;

    if (existingIndex >= 0) {
      profile.skills[existingIndex].level = Math.max(
        profile.skills[existingIndex].level || 0,
        calculatedScore
      );
      if (isPassed) {
        profile.skills[existingIndex].verified = true;
        profile.skills[existingIndex].evidenceType = "faculty-signoff";
        profile.skills[existingIndex].evidenceRef = evidenceRef;
        profile.skills[existingIndex].verifiedAt = new Date();
      }
    } else if (targetSkillId && mongoose.Types.ObjectId.isValid(targetSkillId)) {
      profile.skills.push({
        skill: targetSkillId,
        level: calculatedScore,
        verified: isPassed,
        evidenceType: isPassed ? "faculty-signoff" : "assessment",
        evidenceRef: isPassed ? evidenceRef : undefined,
        verifiedAt: isPassed ? new Date() : undefined,
      });
    }

    // If passed, award badge in portfolio
    if (isPassed) {
      profile.portfolio = profile.portfolio || [];
      const alreadyHasBadge = profile.portfolio.some((p) => p.title === badgeTitle);
      if (!alreadyHasBadge) {
        profile.portfolio.push({
          title: badgeTitle,
          type: "certificate",
          description: `Demonstrated technical excellence in ${skillName} with a verified assessment score of ${calculatedScore}%. Signed by SkillBridge AI Faculty Mentor.`,
          issuedBy: "SkillBridge AI Faculty Mentor Agent",
          date: new Date(),
        });
      }
    }

    await profile.save();

    // Populate skill names for returning
    await profile.populate("skills.skill");

    return res.json({
      success: true,
      score: calculatedScore,
      isPassed,
      correctCount,
      totalQuestions,
      badgeAwarded: isPassed,
      badgeTitle: isPassed ? badgeTitle : null,
      feedback: isPassed
        ? `Outstanding! You scored ${calculatedScore}% in ${skillName}. You have officially earned the SkillBridge AI Faculty Verified Competency Badge.`
        : `You scored ${calculatedScore}%. A passing score of 80% is required for verified status. Review the recommended learning roadmaps and retake anytime!`,
      skills: profile.skills,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return res.status(500).json({
      error: "Failed to submit assessment results.",
      details: error.message,
    });
  }
};
