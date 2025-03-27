import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "text-red-500" : ""} flex gap-3 items-center`}>
        {chat.role === "model" && <ChatbotIcon />}
        <p className="message-text p-3 max-w-[75%] rounded-lg bg-purple-100 break-words text-sm">
          {chat.text}
        </p>
      </div>
    )
  );
};

export default ChatMessage;
