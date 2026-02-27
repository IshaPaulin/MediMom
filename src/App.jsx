import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GestureCollector from './components/GestureCollector';
import ChatBot from './components/Chatbot';
import GestureRecognizer from './components/GestureRecognizer';
import GrowthMilestones from './pages/GrowthMilestones';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/collect" element={<GestureCollector />} />
        <Route path="/" element={<GestureRecognizer />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/growth" element={<ProtectedRoute><GrowthMilestones /></ProtectedRoute>} />
      </Routes>
      <ChatBot />
    </>
  );
}

export default App;