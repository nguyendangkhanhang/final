
const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div className={`flex items-start gap-3 mb-4 ${chat.role === "user" ? "justify-end" : ""}`}>
      {chat.role === "model" && (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="material-symbols-rounded text-white text-lg">support_agent</span>
        </div>
      )}
      <div 
        className={`p-3 rounded-2xl shadow-sm max-w-[80%] ${
          chat.role === "user" 
            ? "bg-blue-500 text-white" 
            : "bg-blue-100"
        } ${chat.isError ? "bg-red-100 text-red-800" : ""}`}
      >
        <p className="message-text break-words text-sm">
          {chat.text}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
