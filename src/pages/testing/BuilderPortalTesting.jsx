import { useState } from "react";
import { supabase } from "../../supabaseClient";

function BuilderPortal() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    // get logged user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!model) {
      alert("Upload a GLB model");
      return;
    }

    // upload model to storage
    // const fileName = `${Date.now()}-${model.name}`;

    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from("models")
    //   .upload(fileName, model);
    const fileName = `${Date.now()}-${model.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("models")
      .upload(`models/${fileName}`, model);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    // get public URL
    // const { data } = supabase.storage.from("models").getPublicUrl(fileName);

    // const modelUrl = data.publicUrl;
    const { data: urlData } = supabase.storage
      .from("models")
      .getPublicUrl(`models/${fileName}`);

    const modelUrl = urlData.publicUrl;

    console.log(user);

    // insert project
    const { error } = await supabase.from("projects").insert({
      builder_id: user.id,
      title,
      city,
      area,
      model_url: modelUrl,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Project uploaded!");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Builder Portal</h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Project Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Area"
          onChange={(e) => setArea(e.target.value)}
        />

        <br />
        <br />

        <input
          type="file"
          accept=".glb,.gltf"
          onChange={(e) => setModel(e.target.files[0])}
        />

        <br />
        <br />

        <button type="submit">
          {loading ? "Uploading..." : "Upload Project"}
        </button>
      </form>
    </div>
  );
}

export default BuilderPortal;
