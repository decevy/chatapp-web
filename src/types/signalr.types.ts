// src/types/signalr.types.ts

export interface RoomEvent {
    userId: number;
    username: string;
    roomId: number;
    timestamp: string;
  }
  
  export interface TypingIndicator {
    userId: number;
    username?: string;
    roomId: number;
    isTyping?: boolean;
  }
  
  export interface MessageEdited {
    id: number;
    content: string;
    editedAt: string;
  }
  
  export interface MessageDeleted {
    id: number;
    roomId: number;
  }
  
  export interface UserStatusChanged {
    userId: number;
    isOnline: boolean;
    lastSeen: string;
  }