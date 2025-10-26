// src/components/MessageInput.tsx

import { useChat } from "../contexts/ChatContext";
import { useState } from "react";

export function MessageInput() {
  const { sendMessage } = useChat();

  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    
    await sendMessage(message);
    setMessage('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const getMessageLineCount = () => {
    return message.split('\n').length;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="m-3 border bg-white border-gray-300 rounded-xl flex items-end focus-within:ring-3 focus-within:ring-blue-100 focus-within:border-blue-300">
        <textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={getMessageLineCount()}
          className="flex-1 p-2.5 border-0 focus:outline-none resize-none no-scrollbar"
        />
        <button 
          disabled={!message.trim()}
          type="submit"
          className="bg-blue-500 disabled:bg-blue-400 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600 m-1"
        >
          Send
        </button>
      </div>
    </form>
  );
}