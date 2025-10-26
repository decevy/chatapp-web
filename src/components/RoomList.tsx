// src/components/RoomList.tsx

import { useChat } from '../contexts/ChatContext';
import { RoomSummary } from '../types/room.types';
import { formatDistanceToNow } from 'date-fns';

export function RoomList() {
  const { rooms, currentRoom, selectRoom } = useChat();

  const handleRoomClick = (roomId: number) => {
    selectRoom(roomId);
  };

  const getLastMessagePreview = (room: RoomSummary): string => {
    if (!room.lastMessage) return 'No messages yet';
    const content = room.lastMessage.content;
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-gray-500 mb-2">No rooms available</p>
        <p className="text-sm text-gray-400">Create or join a room to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Rooms</h2>
        <p className="text-sm text-gray-500">{rooms.length} available</p>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              currentRoom?.id === room.id 
                ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-gray-800">{room.name}</h3>
              {room.lastMessage && (
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(room.lastMessage.createdAt), { addSuffix: true })}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-1">
              {room.memberCount} member{room.memberCount !== 1 ? 's' : ''}
            </p>
            
            <p className="text-sm text-gray-600 truncate">
              {getLastMessagePreview(room)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}