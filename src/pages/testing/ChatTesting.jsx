import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function Chat() {
  const { projectId, builderId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUser();
    fetchMessages();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUserId(data.user.id);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at");

    if (!error) setMessages(data);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const receiver = userId === builderId ? null : builderId;

    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      sender_id: userId,
      receiver_id: receiver,
      message: newMessage,
    });

    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
  }

  return (
    <div>
      <h2>Project Chat</h2>

      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender_id === userId ? "You" : "Builder"}:</b> {msg.message}
          </div>
        ))}
      </div>

      <br />

      <input
        type="text"
        placeholder="Type message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
