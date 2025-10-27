// src/components/MessageList.tsx

import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';

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
      {messages.map((message) => {
        const isOwnMessage = message.user.id === user?.id;
        return (
          <div key={message.id} className={`${isOwnMessage ? 'self-end' : 'self-start'}`}>
            <p className={`px-1.5 text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>{isOwnMessage ? '' : `${message.user.username} `} {format(new Date(message.createdAt), 'HH:mm')}</p>
            <p className={`py-1 px-4 rounded-lg  ${isOwnMessage ? 'bg-blue-200' : 'bg-gray-200'}`}>{message.content}</p>
          </div>
        );
      })}
    </div>
  );
}