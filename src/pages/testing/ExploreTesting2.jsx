import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

function Explore() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setProjects(data);
      setFilteredProjects(data);
    }
  }

  useEffect(() => {
    filterProjects();
  }, [search, cityFilter, statusFilter, typeFilter, projects]);

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

    setFilteredProjects(temp);
  }

  return (
    <div>
      <h2>Explore Projects</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search project..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />
      <br />

      {/* Filters */}

      <select onChange={(e) => setCityFilter(e.target.value)}>
        <option value="">All Cities</option>
        <option value="Chennai">Chennai</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Hyderabad">Hyderabad</option>
      </select>

      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>

      <select onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="">All Building Types</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Commercial">Commercial</option>
      </select>

      <br />
      <br />

      {/* Project Cards */}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "250px",
            }}
          >
            {project.image_urls?.length > 0 && (
              <img src={project.image_urls[0]} alt="project" width="100%" />
            )}

            <h3>{project.title}</h3>

            <p>
              <b>City:</b> {project.city}
            </p>

            <p>
              <b>Status:</b> {project.status}
            </p>

            <p>
              <b>Type:</b> {project.building_type}
            </p>

            <p>
              <b>Price:</b> ₹{project.price}
            </p>

            <Link to={`/project/${project.id}`}>
              <button>View Project</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
