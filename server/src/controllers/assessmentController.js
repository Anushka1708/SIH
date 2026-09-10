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

/**
 * Generate 15-20 comprehensive Initial Diagnostic Assessment questions covering extracted resume skills
 * POST /api/assessments/generate-diagnostic
 */
export const generateDiagnosticQuiz = async (req, res) => {
  try {
    const { skills = [] } = req.body;
    const targetSkills = Array.isArray(skills) && skills.length > 0
      ? skills.slice(0, 5)
      : ["JavaScript", "React", "Node.js", "Python", "System Architecture"];

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

        const prompt = `You are a Chief Technical Examiner on SkillBridge, an accredited higher education platform.
Generate an Initial Comprehensive Diagnostic Assessment with exactly 15 challenging technical multiple-choice questions (MCQs).
The questions must evaluate these extracted candidate competencies: ${targetSkills.join(", ")}.
Distribute questions evenly across these skills (approx 3 questions per skill).

Requirements:
1. Each question must specify the exact "skill" it evaluates (e.g. "React", "Node.js", etc.).
2. Test real-world application, edge cases, and architectural best practices.
3. 4 options per question.
4. correctIndex: integer 0-3.
5. explanation: clear 1-2 sentence justification.

Output STRICTLY a JSON array of 15 objects:
[
  {
    "id": 1,
    "skill": "React",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "..."
  }
]
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith("```")) {
          text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        }

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          const validated = parsed.slice(0, 15).map((q, idx) => ({
            id: q.id || idx + 1,
            skill: q.skill || targetSkills[idx % targetSkills.length],
            question: q.question || `Question ${idx + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < 4
              ? q.correctIndex
              : 0,
            explanation: q.explanation || "Evaluated by SkillBridge AI Diagnostic Engine.",
          }));

          return res.json({
            success: true,
            source: "gemini-3.6-flash",
            totalQuestions: validated.length,
            skills: targetSkills,
            questions: validated,
          });
        }
      } catch (geminiError) {
        console.warn("Diagnostic Gemini generation fallback:", geminiError.message);
      }
    }

    // Comprehensive 15-question Curated Diagnostic Bank
    const curatedDiagnostic = [
      // React
      {
        id: 1,
        skill: "React",
        question: "What is the key advantage of React 18 Concurrent Rendering?",
        options: [
          "It eliminates the need for virtual DOM reconciliation",
          "It allows React to interrupt, pause, or abandon a render in progress to handle urgent user interactions",
          "It converts all frontend components into server-side PHP templates",
          "It forces all asynchronous API calls to execute synchronously",
        ],
        correctIndex: 1,
        explanation: "Concurrent rendering allows React to interrupt non-urgent renders to prioritize high-priority user actions like typing or clicking.",
      },
      {
        id: 2,
        skill: "React",
        question: "Why should you avoid mutating state directly in React (e.g. state.items.push(newItem))?",
        options: [
          "Direct mutation breaks JavaScript memory allocation",
          "React relies on shallow object reference equality (prev !== next) to detect changes and trigger UI re-renders",
          "Direct mutation triggers infinite useEffect execution loops immediately",
          "State objects are frozen by the browser V8 engine",
        ],
        correctIndex: 1,
        explanation: "React relies on immutable updates and reference comparison to detect state changes and schedule necessary component re-renders.",
      },
      {
        id: 3,
        skill: "React",
        question: "When should useCallback be applied in a component hierarchy?",
        options: [
          "Wrap every single function in every component indiscriminately",
          "Only when passing a callback prop to an optimized child component wrapped in React.memo that relies on reference equality",
          "Only when writing async async/await database queries",
          "Whenever a component unmounts",
        ],
        correctIndex: 1,
        explanation: "useCallback caches a function definition between renders; it only provides performance gains when passed to memoized children or dependencies.",
      },
      // Node.js
      {
        id: 4,
        skill: "Node.js",
        question: "In Node.js, what is the responsibility of the libuv thread pool?",
        options: [
          "Executing JavaScript code across 16 parallel V8 worker threads",
          "Offloading blocking I/O tasks like file operations (fs), DNS lookups, and crypto operations that cannot be handled non-blockingly by the OS",
          "Managing client browser cookie sessions",
          "Compiling TypeScript into WebAssembly bytecode",
        ],
        correctIndex: 1,
        explanation: "libuv provides a default 4-thread pool to execute asynchronous tasks that don't have native non-blocking OS primitives.",
      },
      {
        id: 5,
        skill: "Node.js",
        question: "What happens if an unhandled promise rejection occurs in modern Node.js (v16+)?",
        options: [
          "The runtime quietly ignores it and proceeds",
          "The Node.js process terminates with a non-zero exit code by default",
          "The process restarts automatically in debug mode",
          "It redirects the HTTP response to 404",
        ],
        correctIndex: 1,
        explanation: "In modern Node.js, unhandled rejections terminate the process with code 1 unless an unhandledRejection listener is explicitly attached.",
      },
      {
        id: 6,
        skill: "Node.js",
        question: "Which pattern is recommended to prevent memory leaks when serving large 500MB media files in Express?",
        options: [
          "fs.readFileSync and buffering into a single variable",
          "Streaming the file with fs.createReadStream().pipe(res)",
          "Storing the base64 string in a global Map",
          "Spawning a child process for each byte",
        ],
        correctIndex: 1,
        explanation: "Streams process data chunk by chunk without loading the entire 500MB payload into server RAM simultaneously.",
      },
      // Python
      {
        id: 7,
        skill: "Python",
        question: "What is the memory benefit of using Python generators with the 'yield' statement?",
        options: [
          "Generators automatically compress variables on disk",
          "They compute values lazily one-by-one on demand instead of allocating memory for the complete sequence upfront",
          "They disable Python garbage collection cycles",
          "They convert dynamic typing to C++ static typing",
        ],
        correctIndex: 1,
        explanation: "Generators yield values on the fly without storing the entire sequence in memory, ideal for massive datasets and streams.",
      },
      {
        id: 8,
        skill: "Python",
        question: "How does Python handle mutable default arguments in function definitions (e.g. def append_to(item, target=[]))?",
        options: [
          "A fresh new list is created every time the function is called",
          "The default list is instantiated once at function definition time and shared across all subsequent invocations",
          "Python raises a SyntaxError at compile time",
          "The list is converted into an immutable tuple",
        ],
        correctIndex: 1,
        explanation: "Default parameter values are evaluated once when the function is defined, causing mutable defaults like [] to persist across calls.",
      },
      {
        id: 9,
        skill: "Python",
        question: "What is the primary role of the '__slots__' attribute in a Python class?",
        options: [
          "Enabling multi-threading safety",
          "Restricting permitted instance attributes and avoiding the creation of an internal '__dict__', dramatically saving memory",
          "Registering public REST API routes",
          "Enforcing static typing at runtime",
        ],
        correctIndex: 1,
        explanation: "__slots__ tells Python not to use a dict for instance attributes, saving significant RAM when creating millions of objects.",
      },
      // Databases / MongoDB
      {
        id: 10,
        skill: "Databases",
        question: "What does the MongoDB explain('executionStats') tool reveal about an unindexed query?",
        options: [
          "IXSCAN stage with low totalKeysExamined",
          "COLLSCAN stage where every single document in the collection was examined sequentially",
          "Instant cache hit in memory",
          "Automatic creation of a B-Tree index",
        ],
        correctIndex: 1,
        explanation: "Without an index, MongoDB must perform a COLLSCAN (collection scan), checking every document and hurting performance.",
      },
      {
        id: 11,
        skill: "Databases",
        question: "In database engineering, what is the difference between ACID and BASE models?",
        options: [
          "ACID prioritizes immediate consistency and transactions; BASE prioritizes high availability and eventual consistency",
          "ACID is used only for NoSQL; BASE is used only for relational databases",
          "BASE guarantees zero network partitions",
          "There is no difference between them",
        ],
        correctIndex: 0,
        explanation: "ACID ensures strict consistency, whereas BASE (Basically Available, Soft state, Eventual consistency) trades immediate consistency for distributed availability.",
      },
      {
        id: 12,
        skill: "Databases",
        question: "Which HTTP header or database isolation level prevents dirty reads in concurrent transactions?",
        options: [
          "Read Uncommitted",
          "Read Committed, Repeatable Read, or Serializable",
          "Cache-Control: no-cache",
          "Content-Security-Policy",
        ],
        correctIndex: 1,
        explanation: "Read Committed (or stricter isolation levels) guarantees that queries only read data committed by other transactions.",
      },
      // System Architecture & DevOps
      {
        id: 13,
        skill: "System Architecture",
        question: "What problem does the Circuit Breaker pattern solve in distributed microservices?",
        options: [
          "Prevents cascading service failures by failing fast when an external dependency is unhealthy",
          "Encrypts network traffic between VPC subnets",
          "Balances CPU clock speed across VM cores",
          "Generates continuous integration Docker images",
        ],
        correctIndex: 0,
        explanation: "The circuit breaker trips when failure rates cross a threshold, returning immediate fallbacks and preventing cascading exhaustion.",
      },
      {
        id: 14,
        skill: "System Architecture",
        question: "What is the primary role of a Reverse Proxy like NGINX in front of application servers?",
        options: [
          "Compiling backend source code on the fly",
          "SSL/TLS termination, load balancing, request buffering, and static file caching",
          "Managing database foreign key constraints",
          "Executing client-side React hooks",
        ],
        correctIndex: 1,
        explanation: "Reverse proxies shield app servers by handling SSL termination, load balancing, compression, and request buffering efficiently.",
      },
      {
        id: 15,
        skill: "System Architecture",
        question: "Why are JSON Web Tokens (JWT) used for stateless authentication in distributed systems?",
        options: [
          "They cannot be decoded or inspected by anyone",
          "The signature allows any server to verify user identity and claims cryptographically without querying a central session database",
          "They store infinite user data without size restrictions",
          "They replace the need for HTTPS encryption",
        ],
        correctIndex: 1,
        explanation: "JWTs carry signed payloads that servers verify using a shared secret or public key without making remote session lookups.",
      },
    ];

    return res.json({
      success: true,
      source: "curated-diagnostic-engine",
      totalQuestions: curatedDiagnostic.length,
      skills: targetSkills,
      questions: curatedDiagnostic,
    });
  } catch (error) {
    console.error("generateDiagnosticQuiz error:", error);
    return res.status(500).json({ error: "Failed to generate diagnostic assessment." });
  }
};

/**
 * Submit Initial Diagnostic Assessment and compute real per-skill competency levels
 * POST /api/assessments/submit-diagnostic
 */
export const submitDiagnosticQuiz = async (req, res) => {
  try {
    const { questions = [], answers = {} } = req.body;
    const studentUserId = req.user?._id;

    if (!studentUserId) {
      return res.status(401).json({ error: "Unauthorized: student identity required." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "No questions provided in submission." });
    }

    // 1. Calculate per-skill performance
    const skillStats = {}; // { [skillName]: { total, correct } }
    let overallCorrect = 0;

    questions.forEach((q, idx) => {
      const skillName = q.skill || "General Technical";
      if (!skillStats[skillName]) {
        skillStats[skillName] = { total: 0, correct: 0 };
      }
      skillStats[skillName].total += 1;

      const userChoice = answers[idx] !== undefined ? answers[idx] : answers[q.id];
      if (userChoice === q.correctIndex) {
        skillStats[skillName].correct += 1;
        overallCorrect += 1;
      }
    });

    const overallScore = Math.round((overallCorrect / questions.length) * 100);

    // 2. Fetch student profile
    const profile = await StudentProfile.findOne({ user: studentUserId });
    if (!profile) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    // 3. Upsert skills in taxonomy & profile based on actual diagnostic test performance
    const allKnownSkills = await Skill.find();
    const skillMap = new Map();
    allKnownSkills.forEach((s) => skillMap.set(s.name.toLowerCase(), s));

    const skillBreakdown = [];

    for (const [skillName, stats] of Object.entries(skillStats)) {
      const calculatedPercentage = Math.round((stats.correct / stats.total) * 100);
      const isSkillVerified = calculatedPercentage >= 80;

      let skillDoc = skillMap.get(skillName.toLowerCase());
      if (!skillDoc) {
        skillDoc = await Skill.create({
          name: skillName,
          category: "technical",
          description: `Diagnostic verified competency (${skillName})`,
        });
        skillMap.set(skillName.toLowerCase(), skillDoc);
      }

      const existingIndex = profile.skills.findIndex(
        (s) =>
          (s.skill?._id || s.skill)?.toString() === skillDoc._id.toString() ||
          s.skill?.name?.toLowerCase() === skillName.toLowerCase()
      );

      const evidenceRef = `AI-DIAGNOSTIC-${Date.now()}`;

      if (existingIndex > -1) {
        profile.skills[existingIndex].level = calculatedPercentage;
        profile.skills[existingIndex].verified = isSkillVerified;
        profile.skills[existingIndex].evidenceType = isSkillVerified ? "faculty-signoff" : "assessment";
        profile.skills[existingIndex].evidenceRef = evidenceRef;
        if (isSkillVerified) profile.skills[existingIndex].verifiedAt = new Date();
      } else {
        profile.skills.push({
          skill: skillDoc._id,
          level: calculatedPercentage,
          verified: isSkillVerified,
          evidenceType: isSkillVerified ? "faculty-signoff" : "assessment",
          evidenceRef: evidenceRef,
          verifiedAt: isSkillVerified ? new Date() : undefined,
        });
      }

      skillBreakdown.push({
        skill: skillName,
        score: calculatedPercentage,
        correct: stats.correct,
        total: stats.total,
        verified: isSkillVerified,
      });
    }

    // Award Honor Badge if overall score >= 80%
    if (overallScore >= 80) {
      profile.portfolio = profile.portfolio || [];
      const badgeTitle = "Diagnostic Honor Scholar";
      if (!profile.portfolio.some((p) => p.title === badgeTitle)) {
        profile.portfolio.push({
          title: badgeTitle,
          type: "certificate",
          description: `Achieved ${overallScore}% in the Comprehensive Initial Diagnostic Assessment. Verified by SkillBridge AI Faculty Mentor.`,
          issuedBy: "SkillBridge AI Faculty Evaluation Engine",
          date: new Date(),
        });
      }
    }

    await profile.save();
    await profile.populate("skills.skill");

    return res.json({
      success: true,
      overallScore,
      totalQuestions: questions.length,
      overallCorrect,
      skillBreakdown,
      skills: profile.skills,
      feedback:
        overallScore >= 80
          ? `Exceptional diagnostic performance! Your verified skill vector is calibrated at ${overallScore}%. High-fit opportunities unlocked!`
          : `Diagnostic assessment completed. Your initial skill vector has been established at ${overallScore}%. You can retake individual topic assessments anytime under Skills & Assessment.`,
    });
  } catch (error) {
    console.error("submitDiagnosticQuiz error:", error);
    return res.status(500).json({ error: "Failed to submit diagnostic assessment." });
  }
};

