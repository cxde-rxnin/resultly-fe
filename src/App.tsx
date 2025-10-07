import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentPortal from './components/portals/StudentPortal';
import AdminPortal from './components/portals/AdminPortal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<StudentPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
