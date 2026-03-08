// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import BuilderPortal from "./pages/BuilderPortal";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Chat from "./pages/Chat";
import BuilderDashboard from "./pages/BuilderDashboard";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";

import Footer from "./components/Footer";

// --- Error Boundary ---
import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v2m0-16v2m8-8V5m0 4v2m0 4v2m0 4v2"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-4">
              Something Went Wrong
            </h2>
            <p className="text-neutral-600 text-center mb-6">
              We're sorry! An unexpected error occurred. Please try refreshing
              the page or go back home.
            </p>
            <pre className="bg-neutral-100 p-4 rounded-lg text-sm text-neutral-700 mb-6 overflow-auto max-h-40">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Detect session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error.message);
      }
      setProfile(data);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} profile={profile} onLogout={handleLogout} />

        <Routes>
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/builder-dashboard" element={<BuilderDashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/chat/:projectId/:builderId" element={<Chat />} />
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />

          <Route
            path="/builder"
            element={
              user && profile?.role === "builder" ? (
                <BuilderPortal />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace />}
          />
        </Routes>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
