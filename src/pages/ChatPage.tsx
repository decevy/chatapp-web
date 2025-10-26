// src/pages/ChatPage.tsx

import { MessageInput } from '../components/MessageInput';
import { ChatLayout } from '../components/ChatLayout';
import { RoomList } from '../components/RoomList';
import { useChat } from '../contexts/ChatContext';

export function ChatPage() {
  const { currentRoom } = useChat();

  return (
    <ChatLayout
      sidebar={<RoomList />}
      chatArea={
        currentRoom ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {currentRoom.name}
                </h2>
                <p className="text-gray-600">
                  {currentRoom.members.length} member{currentRoom.members.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <div></div>
                </p>
              </div>
            </div>
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