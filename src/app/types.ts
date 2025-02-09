export interface Message {
  id?: string;
  content: string;
  sentAt?: Date;
  sender: MessageSender;
  rate?: number;
}

export enum MessageSender {
  User = 0,
  Chatbot = 1
}

export interface SrStreamMessage<T> {
  type: 'init' | 'data' | 'complete';
  data: T;
}
