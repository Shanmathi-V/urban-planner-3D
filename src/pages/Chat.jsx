import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

// chat testing 3 in use, v4 doesnt update my messages in real time

function Chat() {
  const { projectId, builderId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [otherUserEmail, setOtherUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    determineOtherUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

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
    sender_id,
    sender:profiles!messages_sender_id_fkey(email)
  `,
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (!error) {
      setMessages(data);
      setLoading(false);
    }
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

      if (firstMsg) {
        setOtherUserId(firstMsg.sender_id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", firstMsg.sender_id)
          .single();
        setOtherUserEmail(profile?.email || "User");
      }
    } else {
      // public viewing chat → other user is builder
      setOtherUserId(builderId);
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", builderId)
        .single();
      setOtherUserEmail(profile?.email || "Builder");
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

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
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors mb-6"
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
          Back
        </Link>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          {/* Chat Header */}
          <div className="bg-primary-600 text-white px-6 py-4 border-b border-primary-700">
            <h2 className="text-2xl font-bold">Chat with {otherUserEmail}</h2>
            <p className="text-primary-100 text-sm mt-1">Project Discussion</p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-neutral-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-neutral-300"
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
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.sender_id === userId
                        ? "bg-gray-500 text-white rounded-br-none"
                        : "bg-neutral-200 text-neutral-900 rounded-bl-none"
                    }`}
                  >
                    <p className="wrap-break-word">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender_id === userId
                          ? "text-primary-100"
                          : "text-neutral-600"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-neutral-200 p-6 bg-neutral-50">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-mauve-400 text-white font-semibold rounded-lg hover:bg-mauve-700 disabled:bg-neutral-400 transition-colors flex items-center gap-2"
              >
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
