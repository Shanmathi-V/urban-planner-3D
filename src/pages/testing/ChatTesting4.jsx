import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function Chat() {
  const { projectId, builderId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function initializeChat() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user.id;

    setUserId(currentUser);

    if (currentUser === builderId) {
      // builder → find public user
      const { data: firstMsg } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("project_id", projectId)
        .neq("sender_id", builderId)
        .limit(1)
        .single();

      if (firstMsg) setOtherUserId(firstMsg.sender_id);
    } else {
      // public → builder is receiver
      setOtherUserId(builderId);
    }

    fetchMessages();
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        message,
        sender_id,
        created_at,
        sender:profiles!messages_sender_id_fkey(email)
      `,
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      sender_id: userId,
      receiver_id: otherUserId,
      message: newMessage,
    });

    if (!error) {
      setNewMessage("");
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
            <b>
              {msg.sender_id === userId ? "You" : msg.sender?.email || "User"}:
            </b>{" "}
            {msg.message}
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
