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
    getUser();
    fetchMessages();
    determineOtherUser();
  }, []);

  //real time refreshing test
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUserId(data.user.id);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
    id,
    message,
    created_at,
    sender:profiles!messages_sender_id_fkey(email)
  `,
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data);
  }

  async function determineOtherUser() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user.id;

    if (currentUser === builderId) {
      // builder viewing chat → other user is public
      const { data: firstMsg } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("project_id", projectId)
        .neq("sender_id", builderId)
        .limit(1)
        .single();

      if (firstMsg) setOtherUserId(firstMsg.sender_id);
    } else {
      // public viewing chat → other user is builder
      setOtherUserId(builderId);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    // const receiver = userId === builderId ? null : builderId;

    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      sender_id: userId,
      receiver_id: otherUserId,
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
            <b>{msg.sender?.email || "User"}:</b> {msg.message}
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
