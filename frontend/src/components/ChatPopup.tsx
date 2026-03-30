import { useState } from "react";
import { sendChat } from "../api/ai";
import { RiRobot2Line } from "react-icons/ri";
import { FiX, FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  text: string;
};

interface Props {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Сайн байна уу 👋\n\nБи таны суралцахад туслах AI assistant байна.\n\nТа надаас:\n1. Програмчлалын асуулт\n2. Хичээл болон курсийн зөвлөгөө\n3. Суралцах арга барил\n\nзэрэг зүйлсийг асууж болно.",
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
        {
          role: "assistant",
          text: "Уучлаарай, одоогоор хариулж чадсангүй.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-icon">
            <RiRobot2Line size={18} />
          </div>
          <div>
            <div className="chat-header-title">AI Assistant</div>
            <div className="chat-header-subtitle">Online now</div>
          </div>
        </div>

        <button
          className="chat-close"
          type="button"
          onClick={onClose}
          aria-label="Close chat"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="chat-bubble">
              {m.role === "assistant" ? (
                <div className="chat-markdown">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="chat-bubble typing-bubble">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI assistant..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="button chat-send" onClick={handleSend} type="button">
          <FiSend size={16} />
        </button>
      </div>
    </div>
  );
}