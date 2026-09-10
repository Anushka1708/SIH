import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import StudentDashboard from './pages/StudentDashboard.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import StudentSkills from './pages/StudentSkills.jsx'
import StudentOpportunities from './pages/StudentOpportunities.jsx'
import StudentApplications from './pages/StudentApplications.jsx'
import StudentResume from './pages/StudentResume.jsx'
import StudentLearning from './pages/StudentLearning.jsx'
import StudentSettings from './pages/StudentSettings.jsx'

import CompanyDashboard from './pages/CompanyDashboard.jsx'
import CompanyPostOpportunity from './pages/CompanyPostOpportunity.jsx'
import CompanyApplications from './pages/CompanyApplications.jsx'
import CompanyInternships from './pages/CompanyInternships.jsx'
import CompanyProjects from './pages/CompanyProjects.jsx'
import CompanyProfile from './pages/CompanyProfile.jsx'
import CompanyAnalytics from './pages/CompanyAnalytics.jsx'
import CompanySettings from './pages/CompanySettings.jsx'

import InstitutionDashboard from './pages/InstitutionDashboard.jsx'
import InstitutionStudents from './pages/InstitutionStudents.jsx'
import InstitutionFaculty from './pages/InstitutionFaculty.jsx'
import InstitutionCollaborations from './pages/InstitutionCollaborations.jsx'
import InstitutionLearning from './pages/InstitutionLearning.jsx'
import InstitutionReports from './pages/InstitutionReports.jsx'
import InstitutionSettings from './pages/InstitutionSettings.jsx'

import FacultyDashboard from './pages/FacultyDashboard.jsx'
import FacultyCourses from './pages/FacultyCourses.jsx'
import FacultyStudents from './pages/FacultyStudents.jsx'
import FacultyAssessments from './pages/FacultyAssessments.jsx'
import FacultyMentorship from './pages/FacultyMentorship.jsx'
import FacultyProfile from './pages/FacultyProfile.jsx'
import FacultySettings from './pages/FacultySettings.jsx'

import GoogleAuthCallback from './pages/GoogleAuthCallback.jsx'
import AIChatbot from './components/AIChatbot.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/skills" element={<ProtectedRoute role="student"><StudentSkills /></ProtectedRoute>} />
        <Route path="/student/opportunities" element={<ProtectedRoute role="student"><StudentOpportunities /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>} />
        <Route path="/student/resume" element={<ProtectedRoute role="student"><StudentResume /></ProtectedRoute>} />
        <Route path="/student/learning" element={<ProtectedRoute role="student"><StudentLearning /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute role="student"><StudentSettings /></ProtectedRoute>} />

        {/* Company */}
        <Route path="/company" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/postopportunity" element={<ProtectedRoute role="company"><CompanyPostOpportunity /></ProtectedRoute>} />
        <Route path="/company/applications" element={<ProtectedRoute role="company"><CompanyApplications /></ProtectedRoute>} />
        <Route path="/company/internships" element={<ProtectedRoute role="company"><CompanyInternships /></ProtectedRoute>} />
        <Route path="/company/projects" element={<ProtectedRoute role="company"><CompanyProjects /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute role="company"><CompanyProfile /></ProtectedRoute>} />
        <Route path="/company/analytics" element={<ProtectedRoute role="company"><CompanyAnalytics /></ProtectedRoute>} />
        <Route path="/company/settings" element={<ProtectedRoute role="company"><CompanySettings /></ProtectedRoute>} />

        {/* Institution */}
        <Route path="/institution" element={<ProtectedRoute role="institution"><InstitutionDashboard /></ProtectedRoute>} />
        <Route path="/institution/dashboard" element={<ProtectedRoute role="institution"><InstitutionDashboard /></ProtectedRoute>} />
        <Route path="/institution/students" element={<ProtectedRoute role="institution"><InstitutionStudents /></ProtectedRoute>} />
        <Route path="/institution/faculty" element={<ProtectedRoute role="institution"><InstitutionFaculty /></ProtectedRoute>} />
        <Route path="/institution/collaborations" element={<ProtectedRoute role="institution"><InstitutionCollaborations /></ProtectedRoute>} />
        <Route path="/institution/learning" element={<ProtectedRoute role="institution"><InstitutionLearning /></ProtectedRoute>} />
        <Route path="/institution/reports" element={<ProtectedRoute role="institution"><InstitutionReports /></ProtectedRoute>} />
        <Route path="/institution/settings" element={<ProtectedRoute role="institution"><InstitutionSettings /></ProtectedRoute>} />

        {/* Faculty */}
        <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/courses" element={<ProtectedRoute role="faculty"><FacultyCourses /></ProtectedRoute>} />
        <Route path="/faculty/students" element={<ProtectedRoute role="faculty"><FacultyStudents /></ProtectedRoute>} />
        <Route path="/faculty/assessments" element={<ProtectedRoute role="faculty"><FacultyAssessments /></ProtectedRoute>} />
        <Route path="/faculty/mentorship" element={<ProtectedRoute role="faculty"><FacultyMentorship /></ProtectedRoute>} />
        <Route path="/faculty/profile" element={<ProtectedRoute role="faculty"><FacultyProfile /></ProtectedRoute>} />
        <Route path="/faculty/settings" element={<ProtectedRoute role="faculty"><FacultySettings /></ProtectedRoute>} />
      </Routes>

      {/* Persistent Floating AI Assistant for all authenticated portals */}
      <AIChatbot />
    </>
  )
}