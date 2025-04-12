import { useEffect, useRef, useState } from "react"
import ChatbotIcon from "./ChatbotIcon"
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
      
      if (lowerResponse.includes("product") || lowerResponse.includes("sản phẩm")) {
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

      if (lowerResponse.includes("order") || lowerResponse.includes("đơn hàng")) {
        // Extract order ID from the response
        const orderId = apiResponseText.match(/\b[A-Za-z0-9]{24}\b/)?.[0];
        if (orderId) {
          const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/order-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId })
          });
          const orderData = await orderResponse.json();
          updateHistory(orderData.message);
          return;
        }
      }

      if (lowerResponse.includes("category") || lowerResponse.includes("danh mục")) {
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
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon/>
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon/>
            <p className="message-text">
              Xin chào! Tôi có thể giúp gì cho bạn? / Hello! How can I help you today? 👋
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) =>(
            <ChatMessage key={index} chat={chat}/>
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
    </div>
  )
}

export default Chatbot