import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Handshake, BarChart3 } from "lucide-react";

const features = [
  { icon: GraduationCap, title: "Skill Development", desc: "Personalized learning paths and assessments." },
  { icon: Briefcase, title: "Career Opportunities", desc: "Discover internships, jobs and projects." },
  { icon: Handshake, title: "Industry Collaboration", desc: "Real-world projects and mentorship." },
  { icon: BarChart3, title: "Data Driven Insights", desc: "AI-powered recommendations and analytics." },
];

export default function Landing() {
  return (
    <div>
      <nav className="flex items-center justify-between px-10 py-4 text-white"
        style={{ background: "linear-gradient(180deg, #151235 0%, #211B4E 100%)" }}>
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center">S</div>
          SkillBridge
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#C9C5E8] font-medium">
          <a href="#">Home</a><a href="#">About</a><a href="#">Features</a>
          <a href="#">For Institutions</a><a href="#">Contact</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-ghost !bg-transparent !border-white/20 !text-white !px-4 !py-2 text-sm">Login</Link>
          <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="text-white px-10 py-20 grid md:grid-cols-2 gap-10 items-center"
        style={{ background: "linear-gradient(180deg, #151235 0%, #211B4E 100%)" }}>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Bridging Academia and Industry for a <span className="text-violet">Brighter Future</span>
          </h1>
          <p className="text-[#C9C5E8] mb-6 max-w-md">
            SkillBridge connects students, faculty, institutions and companies to create meaningful opportunities, build skills and drive innovation.
          </p>
         <div className="flex gap-3 mb-10">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-ghost !bg-transparent !border-white/20 !text-white">Learn More</Link>
          </div>
          <div className="flex gap-8 text-sm">
            <div><p className="font-extrabold text-lg">10K+</p><p className="text-[#9791C4]">Students</p></div>
            <div><p className="font-extrabold text-lg">500+</p><p className="text-[#9791C4]">Companies</p></div>
            <div><p className="font-extrabold text-lg">200+</p><p className="text-[#9791C4]">Institutions</p></div>
            <div><p className="font-extrabold text-lg">50+</p><p className="text-[#9791C4]">Collaborations</p></div>
          </div>
        </div>
        <div className="h-64 bg-white/5 rounded-xl2" />
      </section>

      <section className="px-10 py-16">
        <h2 className="text-2xl font-extrabold mb-1">Why SkillBridge?</h2>
        <p className="text-muted mb-8">A unified platform for all stakeholders in the education and industry ecosystem.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="stat-icon bg-[#EEF0FD] text-primary mb-3">
                <f.icon size={20} />
              </div>
              <p className="font-semibold text-[#1E1B33] mb-1">{f.title}</p>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}