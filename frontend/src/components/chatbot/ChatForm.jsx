import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);
    setTimeout(() => {
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);
      generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form flex items-center p-3 rounded-2xl border border-gray-300 shadow-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input w-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
        required
      />
      <button type="submit" className="material-symbols-rounded text-xl text-white bg-purple-700 rounded-full p-2 ml-2 hover:bg-purple-800">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
