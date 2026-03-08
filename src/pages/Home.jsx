import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Home() {
  const [stats, setStats] = useState({
    projects: 0,
    builders: 0,
    users: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    // count projects
    const { count: projectCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    // count builders
    const { count: builderCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "builder");

    // count users
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .neq("role", "builder");

    setStats({
      projects: projectCount || 0,
      builders: builderCount || 0,
      users: userCount || 0,
    });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Discover Your Next{" "}
              <span className="text-primary-600">Urban Project</span>
            </h1>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Explore innovative real estate projects, connect with builders,
              and visualize your future home with cutting-edge 3D technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-8 py-3 bg-amber-950 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
              >
                Explore Projects
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-b-black text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join as Builder
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-base hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.582a1 1 0 00-.895.447l-.94 1.879a1 1 0 01-.895.447h-9.368a1 1 0 01-.895-.447l-.94-1.879A1 1 0 006.582 21H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                3D Building Visualization
              </h3>
              <p className="text-neutral-600">
                View immersive 3D models of projects before they're built
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-base hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Smart Filtering
              </h3>
              <p className="text-neutral-600">
                Find projects by location, price, type, and status
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-base hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Direct Communication
              </h3>
              <p className="text-neutral-600">
                Chat directly with builders and ask questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-rose-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{stats.projects}+</div>
              <p className="text-primary-100">Active Projects</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <p className="text-primary-100">Verified Builders</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <p className="text-primary-100">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Ready to find your next project?
          </h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
            Start exploring innovative real estate projects in your area today
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center px-8 py-4 bg-amber-950 text-white font-semibold text-lg rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
          >
            Browse Projects →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
