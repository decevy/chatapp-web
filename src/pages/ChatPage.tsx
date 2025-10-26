// src/pages/ChatPage.tsx

import { MessageInput } from '../components/MessageInput';
import { ChatLayout } from '../components/ChatLayout';
import { RoomList } from '../components/RoomList';
import { useChat } from '../contexts/ChatContext';
import { MessageList } from '../components/MessageList';

export function ChatPage() {
  const { currentRoom } = useChat();

  return (
    <ChatLayout
      sidebar={<RoomList />}
      chatArea={
        currentRoom ? (
          <div className="flex flex-col h-full">
            <MessageList />
            <MessageInput />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">Select a room to start chatting</p>
              <p className="text-sm">Choose from the list on the left</p>
            </div>
          </div>
        )
      }
    />
  );
}