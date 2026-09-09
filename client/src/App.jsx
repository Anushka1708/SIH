import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import CompanyDashboard from './pages/CompanyDashboard.jsx'
import InstitutionDashboard from './pages/InstitutionDashboard.jsx'
import FacultyDashboard from './pages/FacultyDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import StudentSkills from './pages/StudentSkills.jsx'
import StudentApplications from './pages/StudentApplications.jsx'
import StudentOpportunities from './pages/StudentOpportunities.jsx'
import StudentResume from './pages/StudentResume.jsx'
import StudentLearning from './pages/StudentLearning.jsx'
import StudentSettings from './pages/StudentSettings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/skills" element={<ProtectedRoute role="student"><StudentSkills /></ProtectedRoute>} />
      <Route path="/student/opportunities" element={<ProtectedRoute role="student"><StudentOpportunities /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>} />
      <Route path="/student/resume" element={<ProtectedRoute role="student"><StudentResume /></ProtectedRoute>} />
      <Route path="/student/learning" element={<ProtectedRoute role="student"><StudentLearning /></ProtectedRoute>} />
      <Route path="/student/settings" element={<ProtectedRoute role="student"><StudentSettings /></ProtectedRoute>} />

      {/* Company */}
      <Route path="/company" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/company/postopportunity" element={<ProtectedRoute role="company"><ComingSoon title="Post Opportunity" /></ProtectedRoute>} />
      <Route path="/company/applications" element={<ProtectedRoute role="company"><ComingSoon title="Applications" /></ProtectedRoute>} />
      <Route path="/company/internships" element={<ProtectedRoute role="company"><ComingSoon title="Internships" /></ProtectedRoute>} />
      <Route path="/company/projects" element={<ProtectedRoute role="company"><ComingSoon title="Projects" /></ProtectedRoute>} />
      <Route path="/company/profile" element={<ProtectedRoute role="company"><ComingSoon title="Profile" /></ProtectedRoute>} />
      <Route path="/company/analytics" element={<ProtectedRoute role="company"><ComingSoon title="Analytics" /></ProtectedRoute>} />
      <Route path="/company/settings" element={<ProtectedRoute role="company"><ComingSoon title="Settings" /></ProtectedRoute>} />

      {/* Institution */}
      <Route path="/institution" element={<ProtectedRoute role="institution"><InstitutionDashboard /></ProtectedRoute>} />
      <Route path="/institution/students" element={<ProtectedRoute role="institution"><ComingSoon title="Students" /></ProtectedRoute>} />
      <Route path="/institution/faculty" element={<ProtectedRoute role="institution"><ComingSoon title="Faculty" /></ProtectedRoute>} />
      <Route path="/institution/collaborations" element={<ProtectedRoute role="institution"><ComingSoon title="Collaborations" /></ProtectedRoute>} />
      <Route path="/institution/learning" element={<ProtectedRoute role="institution"><ComingSoon title="Learning Programs" /></ProtectedRoute>} />
      <Route path="/institution/reports" element={<ProtectedRoute role="institution"><ComingSoon title="Reports" /></ProtectedRoute>} />
      <Route path="/institution/settings" element={<ProtectedRoute role="institution"><ComingSoon title="Settings" /></ProtectedRoute>} />

      {/* Faculty */}
      <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/courses" element={<ProtectedRoute role="faculty"><ComingSoon title="Courses" /></ProtectedRoute>} />
      <Route path="/faculty/students" element={<ProtectedRoute role="faculty"><ComingSoon title="Students" /></ProtectedRoute>} />
      <Route path="/faculty/assessments" element={<ProtectedRoute role="faculty"><ComingSoon title="Assessments" /></ProtectedRoute>} />
      <Route path="/faculty/mentorship" element={<ProtectedRoute role="faculty"><ComingSoon title="Mentorship" /></ProtectedRoute>} />
      <Route path="/faculty/profile" element={<ProtectedRoute role="faculty"><ComingSoon title="Profile" /></ProtectedRoute>} />
      <Route path="/faculty/settings" element={<ProtectedRoute role="faculty"><ComingSoon title="Settings" /></ProtectedRoute>} />
    </Routes>
  )
}