import { useState } from "react";
import { sendChat } from "../api/ai";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPopup() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Сайн байна уу 👋 Би таны AI learning assistant байна. Асуултаа бичээрэй.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = { role: "user", text: userText };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChat(userText);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Уучлаарай, одоогоор хариулж чадсангүй." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">AI Assistant</div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="chat-bubble">Typing...</div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="button chat-send" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}