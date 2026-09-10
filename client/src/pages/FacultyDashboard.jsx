// import { LayoutDashboard, BookOpen, Users, ClipboardList, Handshake, User, Settings } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import StatCard from "../components/StatCard";
// import { facultyData as d } from "../data/mockData";
// import { getCurrentUser } from "../utils/auth";

// const items = [
//   { label: "Dashboard", icon: LayoutDashboard, href: "/faculty" },
//   { label: "Courses", icon: BookOpen, href: "/faculty/courses" },
//   { label: "Students", icon: Users, href: "/faculty/students" },
//   { label: "Assessments", icon: ClipboardList, href: "/faculty/assessments" },
//   { label: "Mentorship", icon: Handshake, href: "/faculty/mentorship" },
//   { label: "Profile", icon: User, href: "/faculty/profile" },
//   { label: "Settings", icon: Settings, href: "/faculty/settings" },
// ];

// export default function FacultyDashboard() {
//   const user = getCurrentUser();
//   const displayName = user?.name || d.name;
//   const p = d.performance;
//   const circumference = 2 * Math.PI * 42;
//   const offset = circumference - (p.score / 100) * circumference;

//   return (
//     <div className="flex bg-bg min-h-screen">
//       <Sidebar brand={displayName} subtitle="Faculty" items={items} active="Dashboard" />
//       <div className="flex-1">
//         <Topbar placeholder="Search students, courses..." />
//         <div className="p-6">
//           <h2 className="text-xl font-extrabold mb-1">Welcome, {displayName}!</h2>
//           <p className="text-muted text-sm mb-6">Guide. Mentor. Build future leaders.</p>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {d.stats.map((s) => <StatCard key={s.label} {...s} />)}
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="card">
//               <div className="flex justify-between items-center mb-1">
//                 <p className="font-semibold text-[#1E1B33] text-sm">Upcoming Sessions</p>
//                 <a href="#" className="text-xs text-primary font-semibold">View All</a>
//               </div>
//               <ul>
//                 {d.sessions.map((s) => (
//                   <li key={s.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
//                     <div>
//                       <p className="text-sm font-semibold text-[#1E1B33]">{s.title}</p>
//                       <p className="text-xs text-muted">{s.time}</p>
//                     </div>
//                     <button className="btn-primary !px-4 !py-2 text-xs">Join</button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="card flex items-center gap-6">
//               <svg width="110" height="110" viewBox="0 0 100 100">
//                 <circle cx="50" cy="50" r="42" fill="none" stroke="#ECEBF5" strokeWidth="8" />
//                 <circle cx="50" cy="50" r="42" fill="none" stroke="#4F46E5" strokeWidth="8"
//                   strokeDasharray={circumference} strokeDashoffset={offset}
//                   strokeLinecap="round" transform="rotate(-90 50 50)" />
//                 <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1E1B33">{p.score}%</text>
//               </svg>
//               <div>
//                 <p className="text-sm font-semibold text-[#1E1B33] mb-2">Student Performance</p>
//                 <ul className="text-xs text-muted flex flex-col gap-1.5 font-mono">
//                   <li>🟢 Excellent — {p.excellent}%</li>
//                   <li>🔵 Good — {p.good}%</li>
//                   <li>🟡 Needs Improvement — {p.needsImprovement}%</li>
//                   <li>🔴 Poor — {p.poor}%</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { LayoutDashboard, BookOpen, Users, ClipboardList, Handshake, User, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { facultyData as d } from "../data/mockData";
import { getCurrentUser } from "../utils/auth";

export const facultyItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/faculty" },
  { label: "Courses", icon: BookOpen, href: "/faculty/courses" },
  { label: "Students", icon: Users, href: "/faculty/students" },
  { label: "Assessments", icon: ClipboardList, href: "/faculty/assessments" },
  { label: "Mentorship", icon: Handshake, href: "/faculty/mentorship" },
  { label: "Profile", icon: User, href: "/faculty/profile" },
  { label: "Settings", icon: Settings, href: "/faculty/settings" },
];

export default function FacultyDashboard() {
  const user = getCurrentUser();
  const displayName = user?.name || d.name || "Dr. Rajesh Verma";
  const designation = user?.designation || d.designation || "Placement Head & Senior Professor";
  const p = d.performance;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (p.score / 100) * circumference;

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar brand={displayName} subtitle="Faculty" items={facultyItems} active="Dashboard" />
      <div className="flex-1">
        <Topbar placeholder="Search students, courses..." />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-line gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-[#1E1B33] dark:text-[#F3F4F6]">
                  Welcome, {displayName}!
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  AI Evaluator Online
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm">
                {designation} · Jabalpur Engineering College (NAAC A++)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-indigo-50 dark:bg-[#1E1B3B] text-primary dark:text-indigo-300 px-3 py-2 rounded-xl border border-indigo-200 dark:border-[#2E2A52]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">SkillBridge AI Faculty Agent routing submissions 24/7</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {d.stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-[#1E1B33] text-sm">Upcoming Sessions</p>
                <a href="/faculty/mentorship" className="text-xs text-primary font-semibold">View All</a>
              </div>
              <ul>
                {d.sessions.map((s) => (
                  <li key={s.title} className="flex justify-between items-center py-3 border-b border-line last:border-none">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1B33]">{s.title}</p>
                      <p className="text-xs text-muted">{s.time}</p>
                    </div>
                    <button className="btn-primary !px-4 !py-2 text-xs">Join</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card flex items-center gap-6">
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ECEBF5" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#4F46E5" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1E1B33">{p.score}%</text>
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#1E1B33] mb-2">Student Performance</p>
                <ul className="text-xs text-muted flex flex-col gap-1.5 font-mono">
                  <li>🟢 Excellent — {p.excellent}%</li>
                  <li>🔵 Good — {p.good}%</li>
                  <li>🟡 Needs Improvement — {p.needsImprovement}%</li>
                  <li>🔴 Poor — {p.poor}%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}