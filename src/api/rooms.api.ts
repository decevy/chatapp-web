// src/api/rooms.api.ts

import { api } from './axios-config';
import {
  Room,
  RoomSummary,
  CreateRoomRequest,
  UpdateRoomRequest,
  AddRoomMemberRequest,
  Message,
  PaginatedResponse,
} from '../types/room.types';
import { MessageResponse } from '../types/common.types';

export const roomsApi = {
  async getUserRooms(): Promise<RoomSummary[]> {
    const response = await api.get<RoomSummary[]>('/rooms');
    return response.data;
  },

  async getRoom(roomId: number): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${roomId}`);
    return response.data;
  },

  async createRoom(data: CreateRoomRequest): Promise<Room> {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  async updateRoom(roomId: number, data: UpdateRoomRequest): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${roomId}`, data);
    return response.data;
  },

  async deleteRoom(roomId: number): Promise<void> {
    await api.delete(`/rooms/${roomId}`);
  },

  async addMember(
    roomId: number,
    data: AddRoomMemberRequest
  ): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      `/rooms/${roomId}/members`,
      data
    );
    return response.data;
  },

  async removeMember(roomId: number, userId: number): Promise<void> {
    await api.delete(`/rooms/${roomId}/members/${userId}`);
  },

  async getRoomMessages(
    roomId: number,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResponse<Message>> {
    const response = await api.get<PaginatedResponse<Message>>(
      `/rooms/${roomId}/messages`,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },
};