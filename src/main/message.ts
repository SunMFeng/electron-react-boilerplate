import { MessageType } from './messagetype';

export interface Message {
  messageType: MessageType;
  messageContent: any;
}
