import { useState } from "react";
import ChatPopup from "./ChatPopup";
import { FiMessageCircle } from "react-icons/fi"; 
import "../style/ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="chat-button" onClick={() => setOpen(!open)}>
        <FiMessageCircle size={26} />
      </div>

      {open && <ChatPopup />}
    </>
  );
}