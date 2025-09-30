import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import ActiveSession from './pages/ActiveSession';
import Routines from './pages/Routines';
import { auth } from './firebase';
import './index.css'

import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Exercises from './pages/Exercises';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This processes the result from a redirect sign-in
    // Its success will then be picked up by the onAuthStateChanged observer
    getRedirectResult(auth).catch((error) => {
      console.error("Error processing redirect result:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {user ? (
        <>
          <Navbar />
          <h1>Hey can you see me?</h1>
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/routines" element={<Routines />} />
              <Route path="/session/:sessionId" element={<ActiveSession />} />
              {/* Redirect any other path to the dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;