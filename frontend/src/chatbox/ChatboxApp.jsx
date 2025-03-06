import { useState, useEffect } from "react";
import { Chatbot } from "supersimpledev";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";
import "./ChatboxApp.css";

function ChatboxApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem("messages")) || []);

  useEffect(() => {
    Chatbot.addResponses({
      'goodbye': "Goodbye. Have a great day!",
      'is this product in stock': "Please provide the product code so I can check for you.",
      'check order': "You can enter the order code on the 'Track order' page or provide the code so I can check.",
      'payment method': "We support payment via credit card, PayPal and COD.",
      'delivery time': "Delivery time is 3-5 domestic business days, 7-14 days for international.",
      'return policy': "You can return the product within 7 days if the product is intact.",
      'contact support': "You can call [hotline number] or email [email address] for support.",
      "give me a unique id": function () {
        return `Sure! Here's a unique ID: ${crypto.randomUUID()}`;
      },
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  return (
    <div>
      {/* Nút mở chatbox */}
      <button className="chatbox-button" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Khung chatbox */}
      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <span>Chatbox</span>
            <button onClick={() => setIsOpen(false)}>❌</button>
          </div>
          <div className="chatbox-messages">
            {messages.length === 0 ? (
              <div className="introduction">Welcome to the chatbot!</div>
            ) : (
              <ChatMessage messages={messages} />
            )}
          </div>
          <ChatInput messages={messages} setMessages={setMessages} />
        </div>
      )}
    </div>
  );
}

export default ChatboxApp;
