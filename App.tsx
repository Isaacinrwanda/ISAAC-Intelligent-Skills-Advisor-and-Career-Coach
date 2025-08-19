
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewPractice from './pages/InterviewPractice';
import CareerPath from './pages/CareerPath';
import Applications from './pages/Applications';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/interview" element={<InterviewPractice />} />
          <Route path="/career-path" element={<CareerPath />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
