import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  ChevronDown,
  BookOpen,
  Briefcase,
  Award,
  Navigation,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import api from "../services/api";

const QUICK_PROMPTS = [
  { label: "Analyze my skill gaps", query: "What are my current skill gaps for target internships?" },
  { label: "How to get AI Faculty sign-off?", query: "How do I get my skills verified by AI Faculty?" },
  { label: "Recommend top opportunities", query: "Show me highest matching opportunities for my skill profile." },
  { label: "Explain SIH platform flow", query: "How does the closed-loop academia-industry model work?" },
];

export default function AIChatbot() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: `Hello ${user?.name ? user.name.split(" ")[0] : "there"}! 👋 I'm your SkillBridge AI Assistant. I have live context of your profile, verified skill vector, and career roadmap. How can I guide you today?`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [studentContext, setStudentContext] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch student profile context on mount if user is logged in
  useEffect(() => {
    if (user?.role === "student") {
      api
        .get("/profile/me")
        .then((res) => {
          if (res.data?.profile) {
            setStudentContext(res.data.profile);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Handle message sending
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      const botResponse = generateContextualReply(query, user, studentContext, navigate);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: botResponse.text,
          actions: botResponse.actions,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  // Conversational intelligence engine
  const generateContextualReply = (query, user, profile, navigate) => {
    const q = query.toLowerCase();

    // 1. Skill Gaps & Roadmap Query
    if (q.includes("gap") || q.includes("roadmap") || q.includes("learning")) {
      const skills = profile?.skills || [];
      const unverifiedCount = skills.filter((s) => !s.verified).length;
      return {
        text: `Based on your profile, you have ${skills.length} skills recorded in your vector (${unverifiedCount} pending evidence verification). You can generate customized SWAYAM/NPTEL roadmaps directly on the Opportunities page by clicking the 'AI Roadmap' button on any job card.`,
        actions: [
          { label: "View Learning Roadmap", path: "/student/learning" },
          { label: "Check Opportunities", path: "/student/opportunities" },
        ],
      };
    }

    // 2. AI Faculty Verification Query
    if (q.includes("verify") || q.includes("faculty") || q.includes("assessment") || q.includes("test")) {
      return {
        text: `SkillBridge features an instant AI Faculty Mentor Agent powered by Google Gemini! To verify your skills:\n1. Head to 'Skills & Assessment'.\n2. Click 'Take Test' or 'Retake' next to any skill.\n3. The AI Faculty Agent evaluates your submission and signs off an official digital competency credential!`,
        actions: [
          { label: "Go to Skills & Assessment", path: "/student/skills" },
        ],
      };
    }

    // 3. Opportunities & Jobs Query
    if (q.includes("job") || q.includes("opportunity") || q.includes("internship") || q.includes("match")) {
      return {
        text: `Our AI Match Engine compares your verified skill vector against recruiter requirements with explainable match scores (e.g. 92% High Fit). Check the Opportunities tab to explore active postings from Flipkart, TechCorp, and Google partners.`,
        actions: [
          { label: "Browse Opportunities", path: "/student/opportunities" },
          { label: "My Applications", path: "/student/applications" },
        ],
      };
    }

    // 4. Live Projects & Industry Problem Statements
    if (q.includes("project") || q.includes("live") || q.includes("milestone") || q.includes("company")) {
      return {
        text: `Live Industry Projects allow you to bid on real corporate problem statements. As you complete milestones, the assigned faculty or AI Faculty Agent verifies your code and automatically upgrades your skill vector upon project completion!`,
        actions: [
          { label: "View Dashboard Projects", path: "/student/dashboard" },
        ],
      };
    }

    // 5. Resume & Portfolio
    if (q.includes("resume") || q.includes("portfolio") || q.includes("cv") || q.includes("upload")) {
      return {
        text: `You can upload your primary PDF/DOCX resume in the Resume & Portfolio manager. External links like GitHub and LinkedIn are optional but help increase your match visibility with hiring companies.`,
        actions: [
          { label: "Manage Resume", path: "/student/resume" },
        ],
      };
    }

    // 6. Navigation Assistance
    if (q.includes("profile") || q.includes("settings") || q.includes("theme") || q.includes("dark mode")) {
      return {
        text: `Profile and Settings are conveniently available right from the Topbar user dropdown in the top-right corner. You can also toggle Dark Mode directly from the dropdown or under Account Settings!`,
        actions: [
          { label: "My Profile", path: "/student/profile" },
          { label: "Settings", path: "/student/settings" },
        ],
      };
    }

    // Default Fallback
    return {
      text: `I'm here to accelerate your career readiness on SkillBridge! You can ask me to analyze your skill gaps, explain how AI Faculty verification works, help navigate the portal, or suggest live industry projects.`,
      actions: [
        { label: "Explore Opportunities", path: "/student/opportunities" },
        { label: "Verify Skills", path: "/student/skills" },
      ],
    };
  };

  // Only render for authenticated users
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-600/40 border border-white/20 backdrop-blur-xl"
            title="SkillBridge AI Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Sparkles size={18} className="text-amber-300 animate-pulse" />
            </div>
            <div className="text-left pr-1 hidden sm:block">
              <p className="text-xs font-black tracking-wide leading-none">AI Assistant</p>
              <p className="text-[10px] text-indigo-100 font-medium leading-tight mt-0.5">
                Live Career Mentor
              </p>
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col bg-white dark:bg-[#130F2E] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#2E2A52] overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-4 py-3.5 text-white flex items-center justify-between border-b border-white/10"
              style={{ background: "linear-gradient(135deg, #16123D 0%, #251E56 100%)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/40 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-sm">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black tracking-tight">SkillBridge AI</p>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-200">Faculty & Career Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  title="Close Assistant"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Quick Context Strip */}
            <div className="px-3.5 py-1.5 bg-indigo-50/70 dark:bg-[#1E1B3B] border-b border-indigo-100/60 dark:border-[#2E2A52] flex items-center justify-between text-[10.5px]">
              <span className="text-indigo-900 dark:text-indigo-200 font-semibold flex items-center gap-1">
                <Zap size={11} className="text-amber-500" />
                Role: {user.role ? user.role.toUpperCase() : "STUDENT"}
              </span>
              <span className="text-muted dark:text-[#9CA3AF]">Gemini 1.5 Flash</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAFD] dark:bg-[#0B081E]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-br-none shadow-md shadow-indigo-600/20"
                        : "bg-white dark:bg-[#1E1B3B] text-slate-800 dark:text-[#F3F4F6] border border-slate-200/80 dark:border-[#2E2A52] rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Quick navigation action buttons if returned */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#2E2A52] flex flex-wrap gap-1.5">
                        {m.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              navigate(act.path);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-primary dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition flex items-center gap-1"
                          >
                            <Navigation size={10} />
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted dark:text-[#9CA3AF] mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-muted dark:text-[#9CA3AF] bg-white dark:bg-[#1E1B3B] border border-slate-200 dark:border-[#2E2A52] w-fit px-3 py-2 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={13} className="animate-spin text-primary" />
                  <span className="text-[11px] font-medium">AI Mentor is analyzing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-2 bg-white dark:bg-[#130F2E] border-t border-slate-100 dark:border-[#2E2A52] flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="whitespace-nowrap text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1E1B3B] text-slate-700 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#2E2A52] hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-primary dark:hover:text-indigo-300 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-[#130F2E] border-t border-slate-100 dark:border-[#2E2A52] flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Mentor anything..."
                className="flex-1 bg-slate-100 dark:bg-[#1E1B3B] border border-transparent focus:border-primary dark:focus:border-primary rounded-xl px-3 py-2 text-xs outline-none text-[#1E1B33] dark:text-[#F3F4F6] placeholder:text-muted dark:placeholder:text-[#9CA3AF] transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-primary hover:bg-primaryDark disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
