// src/components/MessageList.tsx

import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef } from 'react';

export function MessageList() {
  const { messages, lastMessage } = useChat();
  const { user } = useAuth();
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({ 
        top: messageListRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [lastMessage]);
  
  return (
    <div ref={messageListRef} className="mx-6 py-3 flex flex-col flex-1 gap-1 overflow-y-auto no-scrollbar">
      {messages.map((message) => (
        <div key={message.id} className={`py-1 px-4 rounded-lg  ${message.user.id === user?.id ? 'self-end bg-blue-200' : 'self-start bg-gray-200'}`}>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}