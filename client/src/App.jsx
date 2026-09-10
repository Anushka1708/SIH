// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // Import Pages
// import Landing from './pages/Landing';
// import Login from './pages/Login';
// import StudentDashboard from './pages/StudentDashboard';
// import FacultyDashboard from './pages/FacultyDashboard';
// import CompanyDashboard from './pages/CompanyDashboard';
// import InstitutionDashboard from './pages/InstitutionDashboard';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-bgDeep text-clay font-body">
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/student" element={<StudentDashboard />} />
//           <Route path="/faculty" element={<FacultyDashboard />} />
//           <Route path="/company" element={<CompanyDashboard />} />
//           <Route path="/institution" element={<InstitutionDashboard />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import CompanyDashboard from './pages/CompanyDashboard.jsx'
import InstitutionDashboard from './pages/InstitutionDashboard.jsx'
import FacultyDashboard from './pages/FacultyDashboard.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/company" element={<CompanyDashboard />} />
      <Route path="/institution" element={<InstitutionDashboard />} />
      <Route path="/faculty" element={<FacultyDashboard />} />
    </Routes>
  )
}