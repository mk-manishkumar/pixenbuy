import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import backendApi from "@/api/backendApi";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const AiChatWidget: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", role: "ai", content: "Hi there! I'm Pixenbot. Looking for a specific product or need some shopping advice?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isChatDisabled) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: "user", content: userMessage }]);
    
    if (!isSignedIn) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: `msg-${Date.now() + 1}`, 
          role: "ai", 
          content: "Please sign in or sign up to use the chat feature!" 
        }]);
        setIsChatDisabled(true);
      }, 500);
      return;
    }

    setIsLoading(true);

    try {
      // Send message history to context
      const history = messages.slice(1); // Exclude the static greeting
      const { data } = await backendApi.post("/api/v1/ai/chat", {
        message: userMessage,
        history,
      });

      setMessages(prev => [...prev, { id: `msg-${Date.now() + 1}`, role: "ai", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      const err = error as { response?: { data?: { error?: string } } };
      setMessages(prev => [...prev, { 
        id: `msg-${Date.now() + 2}`,
        role: "ai", 
        content: err.response?.data?.error || "Sorry, I'm having trouble connecting right now." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window overlay */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: "500px", maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <h3 className="font-semibold text-lg">Pixenbot</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                {msg.role === 'ai' ? (
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                ) : (
                  <div className="text-sm">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isChatDisabled ? "Chat disabled for guests" : "Ask about our products..."}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
              disabled={isLoading || isChatDisabled}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isChatDisabled}
              className="text-indigo-600 disabled:text-gray-400 hover:text-indigo-800 transition-colors flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiChatWidget;
