import {Injectable, NgZone, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SseService} from './sse.service';
import {HttpClient} from '@angular/common/http';
import {Message, MessageSender} from '../types';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  public typingMessage: string = '';
  public messages: Message[] = [];

  constructor(private sseService: SseService, private http: HttpClient, private ngZone: NgZone) { }

  private getResponse(messageId: string) {
    this.sseService
      .getStream<string>(`http://localhost:5199/api/messages/generate-response/${messageId}`,
        {
          eventName: 'message-sending-end',
          handler: (e) => {
            this.ngZone.run(() => {
              const newMessage = JSON.parse(e.data);
              this.messages = [...this.messages, newMessage];
              this.typingMessage = '';
            });
          }
        },
        {
          eventName: 'data',
          handler: (e) => {
            this.ngZone.run(() => {
              this.typingMessage = `${this.typingMessage} ${e.data}`;
            });
          }
        }).subscribe();
  }

  public sendPromptAndGetResponse(message: string) {
    this.http.post<Message>('http://localhost:5199/api/messages/send-message', {message}).subscribe(messageObj => {
      this.ngZone.run(() => {
        this.messages.push(messageObj);
      });

      this.getResponse(messageObj.id);
    });
  }

  public fetchMessages() {
    this.http.get<{messages: Message[]}>('http://localhost:5199/api/messages/get-messages').subscribe(data => {
      this.ngZone.run(() => {
        this.messages = data.messages;
      });
    });
  }
}
