// src/types/room.types.ts

import { User } from './auth.types';

export enum MessageType {
  Text = 0,
  Image = 1,
  File = 2,
  System = 3
}

export interface Message {
  id: number;
  content: string;
  user: User;
  roomId: number;
  createdAt: string;
  editedAt?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  type: MessageType;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  users: User[];
  count: number;
}

export interface RoomMember {
  userId: number;
  username: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  creator: User;
  createdAt: string;
  members: RoomMember[];
}

export interface RoomSummary {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  creator: User;
  createdAt: string;
  memberCount: number;
  lastMessage?: Message;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export interface UpdateRoomRequest {
  name: string;
  description?: string;
}

export interface AddRoomMemberRequest {
  userId: number;
  isAdmin: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}