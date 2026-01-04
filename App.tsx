
import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { seedDatabase } from './services/db';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const StringManagement = React.lazy(() => import('./components/Tables/TrackerManagement'));
const TimeLogging = React.lazy(() => import('./components/TimeRecords/TimeLogging'));
const ChatRoom = React.lazy(() => import('./components/Chat/ChatRoom'));

const ProjectsPlaceholder = () => (
  <div className="p-8 text-center text-white/40 italic glass rounded-2xl">
    Modul Projekty je v přípravě...
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <Router>
      <Suspense fallback={
        <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase animate-pulse">MST System Loading</p>
          </div>
        </div>
      }>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPlaceholder />} />
            <Route path="/tables" element={<StringManagement />} />
            <Route path="/time" element={<TimeLogging />} />
            <Route path="/chat" element={<ChatRoom />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
