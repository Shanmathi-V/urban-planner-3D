import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

function Explore() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProjects(data);
    }
  };

  return (
    <div>
      <h2>Explore Projects</h2>

      {projects.map((project) => (
        <div
          key={project.id}
          style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}
        >
          <h3>{project.title}</h3>
          <p>
            {project.city} - {project.area}
          </p>

          <model-viewer
            src={project.model_url}
            auto-rotate
            camera-controls
            style={{ width: "400px", height: "300px" }}
          ></model-viewer>
        </div>
      ))}
    </div>
  );
}

export default Explore;
