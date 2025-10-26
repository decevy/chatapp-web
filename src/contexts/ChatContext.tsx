// src/contexts/ChatContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { roomsApi } from '../api/rooms.api';
import { signalRService } from '../services/signalr.services';
import { RoomSummary, Room, Message } from '../types/room.types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  rooms: RoomSummary[];
  currentRoom: Room | null;
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  
  loadRooms: () => Promise<void>;
  selectRoom: (roomId: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  leaveCurrentRoom: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const currentRoomRef = useRef<Room | null>(null);
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  const handleReceiveMessage = useCallback((message: Message) => {
    console.log('New message received:', message);
    setMessages(previousMessages => [...previousMessages, message]);
  }, []);

  const handleReconnecting = useCallback(() => {
    console.log('Reconnecting to SignalR');
    setIsConnected(false);
  }, []);

  const handleReconnected = useCallback(() => {
    console.log('Reconnected to SignalR');
    setIsConnected(true);
    if (currentRoomRef.current) {
      signalRService.joinRoom(currentRoomRef.current.id)
        .catch(error => console.error('Failed to rejoin room:', error));
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    console.log('Disconnected from SignalR');
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const connectSignalR = async () => {
      try {
        await connectWithHandlers();
        setIsConnected(true);
      } catch (error) {
        console.error('SignalR Connection Failed:', error);
      }
    };
    connectSignalR();

    return () => {
      const disconnect = async () => {
        await signalRService.disconnect();
      };
      disconnect();
    };
  }, [user]);

  const connectWithHandlers = async () => {
    await signalRService.connect({
      onReceiveMessage: handleReceiveMessage,
      onReconnecting: handleReconnecting,
      onReconnected: handleReconnected,
      onDisconnected: handleDisconnected,
      // todo: add more event handlers later (typing, editing, etc.)
    });
  };

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roomsApi.getUserRooms();
      setRooms(data);
      console.log('Loaded rooms:', data.length);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const selectRoom = useCallback(async (roomId: number) => {
    setIsLoading(true);
    try {
      if (!signalRService.isConnected()) {
        await connectWithHandlers();
      }

      if (currentRoom) {
        await signalRService.leaveRoom(currentRoom.id);
      }

      const [roomData, messagesData] = await Promise.all([
        roomsApi.getRoom(roomId),
        roomsApi.getRoomMessages(roomId, 1, 50)
      ]);

      await signalRService.joinRoom(roomId);

      setCurrentRoom(roomData);
      setMessages(messagesData.items);
      
      console.log(`Joined room: ${roomData.id}`);
    } catch (error) {
      console.error(`Failed to select room ${roomId}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [currentRoom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentRoom || !content.trim()) 
      return;

    try {
      await signalRService.sendMessage(currentRoom.id, content);
      console.log(`Message sent in room ${currentRoom.id}`);
    } catch (error) {
      console.error(`Failed to send message in room ${currentRoom.id}:`, error);
    }
  }, [currentRoom]);

  const leaveCurrentRoom = useCallback(async () => {
    if (!currentRoom) return;

    try {
      await signalRService.leaveRoom(currentRoom.id);
      setCurrentRoom(null);
      setMessages([]);
      console.log(`Left room: ${currentRoom.id}`);
    } catch (error) {
      console.error(`Failed to leave room ${currentRoom.id}:`, error);
    }
  }, [currentRoom]);

  const value: ChatContextType = {
    rooms,
    currentRoom,
    messages,
    isLoading,
    isConnected,
    loadRooms,
    selectRoom,
    sendMessage,
    leaveCurrentRoom,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}