import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      setError("Could not load project");
      return;
    }

    setTitle(data.title);
    setCity(data.city);
    setArea(data.area);
    setPrice(data.price);
    setBuildingType(data.building_type);
    setStatus(data.status);
    setDescription(data.description);
    setContact(data.contact_details);
    setLatitude(data.latitude);
    setLongitude(data.longitude);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        city,
        area,
        price,
        building_type: buildingType,
        status,
        description,
        contact_details: contact,
        latitude,
        longitude,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);

      setTimeout(() => {
        navigate("/builder-dashboard");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Edit Project
          </h1>
          <p className="text-lg text-neutral-600">
            Update your project details and keep information accurate.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">
                ✓ Project updated successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Basic Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Building Type
                    </label>
                    <select
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="border-t border-neutral-200 pt-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Project Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <input
                  type="text"
                  placeholder="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                placeholder="Project Description"
                className="w-full mt-5 px-4 py-3 border border-neutral-300 rounded-lg"
              />
            </div>

            {/* Contact & Location */}
            <div className="border-t border-neutral-200 pt-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Location & Contact
              </h2>

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Contact Details"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
                />

                <div className="grid grid-cols-2 gap-5">
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="px-4 py-3 border border-neutral-300 rounded-lg"
                  />

                  <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="px-4 py-3 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="border-t border-neutral-200 pt-8 flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/builder-dashboard")}
                className="w-full py-4 border border-neutral-300 rounded-lg hover:bg-neutral-100 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-semibold"
              >
                {loading ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProject;
