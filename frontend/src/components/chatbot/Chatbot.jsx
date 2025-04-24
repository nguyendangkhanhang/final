import { useEffect, useRef, useState } from "react"
import ChatForm from "./ChatForm"
import ChatMessage from "./ChatMessage";
import { companyInfo } from "../../companyInfo";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    //Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking..."), {role: "model", text, isError}]);
    };

    //Format chat history for API request
    history = history.map(({role, text}) => ({role, parts: [{text}]}));

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents: history}),
    };

    try {
      //Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong!");
      
      //Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

      // Check if the response contains keywords that indicate database queries
      const lowerResponse = apiResponseText.toLowerCase();
      
      if (lowerResponse.includes("product")) {
        // Extract product search query from the response
        const query = apiResponseText.split(/product|sản phẩm/i)[1]?.trim();
        if (query) {
          const productResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/recommend-products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
          });
          const productData = await productResponse.json();
          updateHistory(productData.message);
          return;
        }
      }

      // Check for order tracking requests
      if (lowerResponse.includes("track") || lowerResponse.includes("order") || lowerResponse.includes("status")) {
        // Extract order ID from the response using regex
        const orderIdMatch = apiResponseText.match(/\b[A-Za-z0-9]{24}\b/);
        if (orderIdMatch) {
          const orderId = orderIdMatch[0];
          const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/order-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId })
          });
          const orderData = await orderResponse.json();
          updateHistory(orderData.message);
          return;
        } else {
          // If no order ID is found, ask for it
          updateHistory("I can help you track your order. Please provide your order ID.");
          return;
        }
      }

      if (lowerResponse.includes("category")) {
        const categoryResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/categories`);
        const categoryData = await categoryResponse.json();
        updateHistory(categoryData.message);
        return;
      }

      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <div className="fixed bottom-4 right-8 z-50">
      <button 
        onClick={() => setShowChatbot((prev) => !prev)} 
        className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm opacity-30"></div>
        
        {/* Main icon */}
        <div className="relative z-10">
          <span className={`material-symbols-rounded text-white text-2xl transition-all duration-300 ${showChatbot ? "opacity-0 rotate-180" : "opacity-100"}`}>
            support_agent
          </span>
          <span className={`material-symbols-rounded text-white text-2xl absolute top-0 left-0 transition-all duration-300 ${showChatbot ? "opacity-100" : "opacity-0 rotate-180"}`}>
            close
          </span>
        </div>

        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with us
        </div>
      </button>
      
      {showChatbot && (
        <div className="fixed bottom-20 right-8 bg-white rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col transition-all duration-300 animate-fadeIn">
          {/* Chatbot Header */}
          <div className="chat-header bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-t-2xl flex items-center justify-between">
            <div className="header-info flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-lg">support_agent</span>
              </div>
              <div>
                <h2 className="logo-text text-white font-bold text-base">Chatbot Assistant</h2>
                <p className="text-blue-200 text-xs">Online</p>
              </div>
            </div>

          </div>

          {/* Chatbot Body */}
          <div 
            ref={chatBodyRef} 
            className=" flex-1 overflow-y-auto p-3 bg-gray-50"
          >
            <div className="message bot-message flex items-start gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-lg">support_agent</span>
              </div>
              <div className="bg-blue-100 p-2 rounded-xl shadow-sm max-w-[80%]">
                  Hello! How can I help you today? 👋
              </div>
            </div>

            {/* Render the chat history dynamically */}
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat}/>
            ))}
          </div>

          {/* Chatbot Footer */}
          <div className="chat-footer p-3 bg-white border-t border-gray-200">
            <ChatForm 
              chatHistory={chatHistory} 
              setChatHistory={setChatHistory} 
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot