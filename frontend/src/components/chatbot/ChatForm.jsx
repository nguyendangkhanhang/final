import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, isBotProcessing }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // check chatbot có đang trả lời không -> có thì vô hiệu hóa gửi thêm tin nhắn.
    if (isBotProcessing) return;

    // lấy thông tin từ ô input
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);
    setTimeout(() => {
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);
      generateBotResponse([
        ...chatHistory,
        { role: "user", text: userMessage }
      ]);      
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message..."
        className="flex-1 py-2 px-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
        required
      />
      <button
        type="submit"
        disabled={isBotProcessing}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 ${
          isBotProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <span className="material-symbols-rounded text-xl">arrow_upward</span>
      </button>
    </form>
  );
};

export default ChatForm;
