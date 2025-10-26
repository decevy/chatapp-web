// src/components/MessageInput.tsx

import { useChat } from "../contexts/ChatContext";
import { useState } from "react";

export function MessageInput() {
  const { isConnected, sendMessage } = useChat();

  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    
    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageLineCount = () => {
    return message.split('\n').length;
  };

  return (
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
        disabled={!message.trim() || !isConnected}
        onClick={handleClick}
        className="bg-blue-500 disabled:bg-gray-400 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600 m-1"
      >
        Send
      </button>
    </div>
  );
}