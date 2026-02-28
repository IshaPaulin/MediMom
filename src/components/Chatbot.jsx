import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "Is spotting normal in first trimester?",
  "What foods should I avoid?",
  "How often should I feel baby kick?",
  "Is paracetamol safe during pregnancy?",
  "What are signs of preeclampsia?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm Mia, your MediMom pregnancy assistant. I'm here 24/7 to answer your questions, ease your worries, and guide you through your pregnancy journey.\n\nWhat's on your mind today? 💕",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call our own serverless function instead of Anthropic directly
    const API_KEY = import.meta.env.API_KEY;

const geminiMessages = newMessages.map(m => ({
  role: m.role === "assistant" ? "model" : "user",
  parts: [{ text: m.content }]
}));

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: "You are Mia, MediMom's warm pregnancy health assistant. Answer only pregnancy-related questions with empathy and care. For dangerous symptoms always recommend immediate medical attention." }] },
      contents: geminiMessages,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
    })
  }
);

const data = await response.json();
const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that. Please try again.";
setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please check your internet and try again. 💕",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap');

        .mia-widget * { box-sizing: border-box; font-family: 'Nunito', sans-serif; }

        .mia-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f472b6, #ec4899);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(236,72,153,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 1000;
        }
        .mia-fab:hover { transform: scale(1.08); box-shadow: 0 6px 30px rgba(236,72,153,0.55); }
        .mia-fab svg { width: 28px; height: 28px; color: white; }

        .mia-window {
          position: fixed;
          bottom: 104px;
          right: 28px;
          width: 380px;
          height: 560px;
          background: #fff8fb;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(236,72,153,0.18), 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 999;
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mia-header {
          background: linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mia-avatar {
          width: 42px; height: 42px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          border: 2px solid rgba(255,255,255,0.4);
        }
        .mia-header-text h3 {
          margin: 0; color: white;
          font-size: 16px; font-weight: 800;
          font-family: 'Quicksand', sans-serif;
        }
        .mia-header-text p {
          margin: 0; color: rgba(255,255,255,0.85);
          font-size: 12px; font-weight: 500;
          display: flex; align-items: center; gap: 4px;
        }
        .mia-online-dot {
          width: 7px; height: 7px;
          background: #86efac;
          border-radius: 50%;
          display: inline-block;
        }
        .mia-close {
          margin-left: auto;
          background: rgba(255,255,255,0.2);
          border: none; cursor: pointer;
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 16px;
          transition: background 0.2s;
        }
        .mia-close:hover { background: rgba(255,255,255,0.35); }

        .mia-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
        }
        .mia-messages::-webkit-scrollbar { width: 4px; }
        .mia-messages::-webkit-scrollbar-track { background: transparent; }
        .mia-messages::-webkit-scrollbar-thumb { background: #f9a8d4; border-radius: 4px; }

        .mia-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.55;
          font-weight: 500;
          white-space: pre-wrap;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mia-bubble.assistant {
          background: white;
          color: #4a1a35;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 2px 8px rgba(236,72,153,0.1);
        }
        .mia-bubble.user {
          background: linear-gradient(135deg, #f472b6, #ec4899);
          color: white;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }

        .mia-typing {
          display: flex; align-items: center; gap: 4px;
          padding: 12px 16px;
          background: white;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 2px 8px rgba(236,72,153,0.1);
          width: fit-content;
        }
        .mia-typing span {
          width: 7px; height: 7px;
          background: #f472b6;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .mia-typing span:nth-child(2) { animation-delay: 0.2s; }
        .mia-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .mia-suggestions {
          padding: 8px 16px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          border-top: 1px solid #fce7f3;
        }
        .mia-suggestions::-webkit-scrollbar { display: none; }
        .mia-suggestion-btn {
          white-space: nowrap;
          padding: 6px 12px;
          background: white;
          border: 1.5px solid #f9a8d4;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #db2777;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Nunito', sans-serif;
        }
        .mia-suggestion-btn:hover {
          background: #fdf2f8;
          border-color: #ec4899;
          transform: translateY(-1px);
        }

        .mia-input-area {
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #fce7f3;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        .mia-input {
          flex: 1;
          border: 1.5px solid #f9a8d4;
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 500;
          outline: none;
          resize: none;
          background: #fff8fb;
          color: #4a1a35;
          transition: border-color 0.2s;
          max-height: 80px;
          line-height: 1.4;
        }
        .mia-input:focus { border-color: #ec4899; background: white; }
        .mia-input::placeholder { color: #f9a8d4; }

        .mia-send {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f472b6, #ec4899);
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
          flex-shrink: 0;
        }
        .mia-send:hover:not(:disabled) { transform: scale(1.08); }
        .mia-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .mia-send svg { width: 18px; height: 18px; color: white; }

        @media (max-width: 440px) {
          .mia-window { width: calc(100vw - 32px); right: 16px; bottom: 96px; }
          .mia-fab { right: 16px; bottom: 16px; }
        }
      `}</style>

      <div className="mia-widget">
        {/* FAB Button */}
        <button className="mia-fab" onClick={() => setIsOpen(!isOpen)} aria-label="Open MediMom Chat">
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="mia-window">
            {/* Header */}
            <div className="mia-header">
              <div className="mia-avatar">🤱</div>
              <div className="mia-header-text">
                <h3>Mia — MediMom AI</h3>
                <p><span className="mia-online-dot" /> Always here for you</p>
              </div>
              <button className="mia-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Messages */}
            <div className="mia-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`mia-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="mia-typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="mia-suggestions">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="mia-suggestion-btn"
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="mia-input-area">
              <textarea
                ref={inputRef}
                className="mia-input"
                placeholder="Ask Mia anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <button
                className="mia-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}