import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import WalkthroughViewer from "../components/WalkthroughViewer";

//broken- tried to add 3d walkthrough

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [walkthrough, setWalkthrough] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setProject(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Project not found
          </h2>
          <p className="text-neutral-600 mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Link
            to="/explore"
            className="text-primary-600 font-semibold hover:underline"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/explore"
          className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Model */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96 bg-neutral-200">
                {project.image_urls?.length > 0 ? (
                  <img
                    src={project.image_urls[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {project.image_urls?.length > 1 && (
                <div className="p-4 border-t border-neutral-200 grid grid-cols-4 gap-3">
                  {project.image_urls.slice(0, 4).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 3D Model Viewer */}
            {project.model_url && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    View in 3D / AR (AR Supported Devices Only)
                  </h3>
                </div>
                <model-viewer
                  src={project.model_url}
                  ar
                  ar-modes="scene-viewer quick-look webxr"
                  camera-controls
                  auto-rotate
                  ar-placement="floor"
                  touch-action="pan-y"
                  shadow-intensity="1"
                  min-camera-orbit="auto auto 4m"
                  max-camera-orbit="auto auto infinity"
                  field-of-view="45deg"
                  max-field-of-view="80deg"
                  style={{ width: "100%", height: "500px" }}
                ></model-viewer>
                <div className="p-4 justify-center hidden md:flex">
                  <button
                    onClick={() => setWalkthrough(true)}
                    className="px-6 py-3 bg-emerald-950 text-white rounded-lg font-semibold hover:bg-emerald-700"
                  >
                    Enter Walkthrough Mode
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="bg-white rounded-xl shadow-base p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  About This Project
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            {/* Project Info Card */}
            <div className="bg-white rounded-xl shadow-lg sticky top-24">
              <div className="p-8">
                {/* Title */}
                <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                  {project.title}
                </h1>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">Price</p>
                  <p className="text-4xl font-bold text-amber-700">
                    ₹{project.price}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  {project.status && (
                    <div className="inline-block">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          project.status === "upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : project.status === "ongoing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-3 mt-1 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-neutral-600">Location</p>
                      <p className="font-semibold text-neutral-900">
                        {project.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-3 mt-1 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <div>
                      <p className="text-sm text-neutral-600">Building Type</p>
                      <p className="font-semibold text-neutral-900">
                        {project.building_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-3 mt-1 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-neutral-600">Area</p>
                      <p className="font-semibold text-neutral-900">
                        {project.area}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                {project.contact_details && (
                  <div className="mb-8 pb-8 border-b border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-2">
                      Contact Builder
                    </p>
                    <p className="font-semibold text-neutral-900">
                      {project.contact_details}
                    </p>
                  </div>
                )}

                {/* Chat Button */}
                <Link to={`/chat/${project.id}/${project.builder_id}`}>
                  <button className="w-full px-6 py-3 bg-amber-950 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    Chat with Builder
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {walkthrough && (
        <WalkthroughViewer
          modelUrl={project.model_url}
          onClose={() => setWalkthrough(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
