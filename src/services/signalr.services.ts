// src/services/signalr.service.ts

import * as signalR from '@microsoft/signalr';
import { tokenService } from './token.service';
import { Message } from '../types/room.types';
import {
  RoomEvent,
  TypingIndicator,
  MessageEdited,
  MessageDeleted,
  UserStatusChanged,
} from '../types/signalr.types';

export type SignalREventHandlers = {
  onReceiveMessage?: (message: Message) => void;
  onMessageEdited?: (data: MessageEdited) => void;
  onMessageDeleted?: (data: MessageDeleted) => void;
  onUserJoinedRoom?: (data: RoomEvent) => void;
  onUserLeftRoom?: (data: RoomEvent) => void;
  onUserStartedTyping?: (data: TypingIndicator) => void;
  onUserStoppedTyping?: (data: TypingIndicator) => void;
  onUserStatusChanged?: (data: UserStatusChanged) => void;
  onReconnected?: () => void;
  onDisconnected?: () => void;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private handlers: SignalREventHandlers = {};

  async connect(handlers: SignalREventHandlers): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.handlers = handlers;
    const token = tokenService.getAccessToken();

    if (!token) {
      throw new Error('No access token available');
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7011/chatHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveMessage', (message: Message) => {
      this.handlers.onReceiveMessage?.(message);
    });

    this.connection.on('MessageEdited', (data: MessageEdited) => {
      this.handlers.onMessageEdited?.(data);
    });

    this.connection.on('MessageDeleted', (data: MessageDeleted) => {
      this.handlers.onMessageDeleted?.(data);
    });

    this.connection.on('UserJoinedRoom', (data: RoomEvent) => {
      this.handlers.onUserJoinedRoom?.(data);
    });

    this.connection.on('UserLeftRoom', (data: RoomEvent) => {
      this.handlers.onUserLeftRoom?.(data);
    });

    this.connection.on('UserStartedTyping', (data: TypingIndicator) => {
      this.handlers.onUserStartedTyping?.(data);
    });

    this.connection.on('UserStoppedTyping', (data: TypingIndicator) => {
      this.handlers.onUserStoppedTyping?.(data);
    });

    this.connection.on('UserStatusChanged', (data: UserStatusChanged) => {
      this.handlers.onUserStatusChanged?.(data);
    });

    this.connection.onreconnected(() => {
      console.log('SignalR Reconnected');
      this.handlers.onReconnected?.();
    });

    this.connection.onclose(() => {
      console.log('SignalR Disconnected');
      this.handlers.onDisconnected?.();
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async joinRoom(roomId: number): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('JoinRoom', roomId);
  }

  async leaveRoom(roomId: number): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('LeaveRoom', roomId);
  }

  async sendMessage(roomId: number, content: string): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('SendMessage', roomId, content);
  }

  async editMessage(messageId: number, newContent: string): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('EditMessage', messageId, newContent);
  }

  async deleteMessage(messageId: number): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('DeleteMessage', messageId);
  }

  async startTyping(roomId: number): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('StartTyping', roomId);
  }

  async stopTyping(roomId: number): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('StopTyping', roomId);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();