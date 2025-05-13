import { useEffect, useRef, useState } from "react";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "../../companyInfo";
import { formatPrice } from "../../Utils/cartUtils";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: companyInfo }
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const detectIntent = (input) => {
    const lower = input.toLowerCase();
  
    if (lower.match(/order\b|status\b|track\b/) || lower.match(/\b[a-f0-9]{24}\b/)) {
      return "orderStatus";
    }
  
    if (lower.includes("new") || lower.includes("arrival") || lower.includes("latest")) {
      return "newProducts";
    }
  
    if (lower.includes("recommend") || lower.includes("top") || lower.includes("popular") || lower.includes("best")) {
      return "topProducts";
    }
  
    if (lower.includes("category") || lower.includes("categories")) {
      return "categories";
    }
  
    return "unknown";
  };  

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError }
      ]);
    };
  
    const lastUserMsg = history.filter(m => m.role === "user").at(-1)?.text || "";
    const intent = detectIntent(lastUserMsg);

    try {
      switch (intent) {
        case "categories": {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/categories`);
          const data = await res.json();
          const formatted = data.categories?.map(c => `– ${c}`).join("\n");
          updateHistory(formatted ? `Available categories:\n${formatted}` : "No categories available.");
          return;
        }

        case "newProducts": {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/new-products`);
          const data = await res.json();
          const formatted = data.products?.map(p => `– ${p.name}: ${formatPrice(p.price)}`).join("\n");
          updateHistory(formatted ? `Newest arrivals:\n${formatted}` : "No new products found.");
          return;
        }

        case "topProducts": {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/top-products`);
          const data = await res.json();
          const topRated = data.products?.filter(p => p.rating >= 4);
          const formatted = topRated?.map(p => `• ${p.name}\n  ⭐ ${p.rating} stars\n  💰 ${formatPrice(p.price)}`).join("\n\n");
          updateHistory(formatted ? `Here are our top-rated products (4+ stars):\n\n${formatted}` : "No top-rated products found.");
          return;
        }

        case "orderStatus": {
          const orderIdMatch = lastUserMsg.match(/\b[a-f0-9]{24}\b/);
          if (orderIdMatch) {
            const orderId = orderIdMatch[0];
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chatbot/order-status`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId })
            });
            const data = await res.json();
            updateHistory(`Order Status:\n\n${data.message}`);
          } else {
            updateHistory("Please provide a valid order ID (24 characters).");
          }
          return;
        }

        default: {
          // ONLY fallback to Gemini if intent === 'unknown'
          const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
          const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: formattedHistory }),
          });
      
          const data = await response.json();
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
          updateHistory(answer);
        }
      }
    } catch (err) {
      updateHistory(err.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="fixed bottom-4 right-8 z-50">
      <button
        onClick={() => setShowChatbot(prev => !prev)}
        className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm opacity-30"></div>
        <div className="relative z-10">
          <span className={`material-symbols-rounded text-white text-2xl transition-all duration-300 ${showChatbot ? "opacity-0 rotate-180" : "opacity-100"}`}>
            support_agent
          </span>
          <span className={`material-symbols-rounded text-white text-2xl absolute top-0 left-0 transition-all duration-300 ${showChatbot ? "opacity-100" : "opacity-0 rotate-180"}`}>
            close
          </span>
        </div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with us
        </div>
      </button>

      {showChatbot && (
        <div className="fixed bottom-20 right-8 bg-white rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col transition-all duration-300 animate-fadeIn">
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

          <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="message bot-message flex items-start gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-lg">support_agent</span>
              </div>
              <div className="bg-blue-100 p-2 rounded-xl shadow-sm max-w-[80%]">
                Hello! How can I help you today? 👋
              </div>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chat-footer p-3 bg-white border-t border-gray-200">
            {/* props */}
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
