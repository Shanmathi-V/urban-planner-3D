import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function Explore() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState(100000000);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProjects(data);
      setFilteredProjects(data);
    }
  }

  useEffect(() => {
    filterProjects();
  }, [search, cityFilter, statusFilter, typeFilter, priceRange, projects]);

  function filterProjects() {
    let temp = [...projects];

    if (search) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (cityFilter) {
      temp = temp.filter((p) => p.city === cityFilter);
    }

    if (statusFilter) {
      temp = temp.filter((p) => p.status === statusFilter);
    }

    if (typeFilter) {
      temp = temp.filter((p) => p.building_type === typeFilter);
    }

    temp = temp.filter((p) => p.price <= priceRange);

    setFilteredProjects(temp);
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
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Explore Projects
          </h1>
          <p className="text-lg text-neutral-600">
            Discover {projects.length} amazing real estate projects in your area
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-base p-6 mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search projects by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-950 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-950 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Cities</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-950 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Building Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-950 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Max Price: ₹{(priceRange / 10000000).toFixed(1)} Cr
              </label>
              <input
                type="range"
                min="0"
                max="100000000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-neutral-600">
            Showing{" "}
            <span className="font-semibold text-neutral-900">
              {filteredProjects.length}
            </span>{" "}
            projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-base hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-neutral-200">
                  {project.image_urls?.length > 0 ? (
                    <img
                      src={project.image_urls[0]}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-neutral-400"
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
                  <div className="absolute top-3 right-3">
                    <span className={getStatusBadge(project.status)}>
                      {project.status?.charAt(0).toUpperCase() +
                        project.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3 line-clamp-2 hover:text-amber-700 cursor-pointer">
                    {project.title}
                  </h3>

                  {/* Details Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-neutral-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {project.city}
                    </div>

                    <div className="flex items-center text-neutral-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      {project.building_type}
                    </div>

                    <div className="flex items-center text-neutral-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {project.area}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-amber-700 mb-6">
                    ₹{(project.price / 10000000).toFixed(2)} Cr
                  </div>

                  {/* View Button */}
                  <Link to={`/project/${project.id}`}>
                    <button className="w-full px-4 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      View Project
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-neutral-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No projects found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your filters to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
