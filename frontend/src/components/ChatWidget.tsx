import { useState } from "react";
import ChatPopup from "./ChatPopup";
import { RiRobot2Line } from "react-icons/ri";
import "../style/ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`chat-button ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle chat assistant"
        type="button"
      >
        <RiRobot2Line size={28} />
        <span className="chat-ping" />
      </button>

      {open && <ChatPopup onClose={() => setOpen(false)} />}
    </>
  );
}