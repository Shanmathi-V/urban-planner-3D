import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

function BuilderDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     fetchBuilderProjects();
  //   }, []);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "builder") {
      navigate("/");
      return;
    }

    fetchBuilderProjects(user.id);
  }

  //   async function fetchBuilderProjects() {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) return;

  //     const { data, error } = await supabase
  //       .from("projects")
  //       .select("*")
  //       .eq("builder_id", user.id)
  //       .order("created_at", { ascending: false });

  //     if (!error) setProjects(data);
  //   }

  async function fetchBuilderProjects(userId) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("builder_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setProjects(data);
  }

  async function deleteProject(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-700" },
      ongoing: { bg: "bg-yellow-100", text: "text-yellow-700" },
      completed: { bg: "bg-green-100", text: "text-green-700" },
    };

    const style = statusMap[status] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
    };

    return `inline-block px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900">
              Builder Dashboard
            </h1>
            <p className="text-neutral-600 mt-2">
              Manage your uploaded projects
            </p>
          </div>

          <Link to="/builder">
            <button className="px-6 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 transition">
              + Add Project
            </button>
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-base hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 bg-neutral-200">
                  {project.image_urls?.length > 0 ? (
                    <img
                      src={project.image_urls[0]}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      No Image
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className={getStatusBadge(project.status)}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                    {project.title}
                  </h3>

                  <div className="text-sm text-neutral-600 mb-2">
                    {project.city}
                  </div>

                  <div className="text-sm text-neutral-600 mb-4">
                    {project.building_type}
                  </div>

                  <div className="text-xl font-bold text-amber-700 mb-5">
                    ₹{(project.price / 10000000).toFixed(2)} Cr
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/project/${project.id}`} className="w-full">
                      <button className="w-full py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-900 font-semibold">
                        View
                      </button>
                    </Link>

                    <Link to={`/edit-project/${project.id}`} className="w-full">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-neutral-900">
              No Projects Yet
            </h3>
            <p className="text-neutral-600 mt-2">
              Upload your first project to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuilderDashboard;
