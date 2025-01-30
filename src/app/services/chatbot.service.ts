import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { SseService } from '@/app/services/sse.service';
import { HttpClient } from '@angular/common/http';
import { Message } from '@/app/types';
import { environment } from '@/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService implements OnDestroy {
  public isTypingMessage = false;
  public messages: Message[] = [];

  private currentTypingMessageId: string | null = null;
  private eventSource: EventSource | null = null;

  constructor(
    private sseService: SseService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  public sendPromptAndGetResponse(message: string) {
    this.http
      .post<Message>(`${environment.apiUrl}/messages/send-message`, {
        message
      })
      .subscribe((messageObj) => {
        this.ngZone.run(() => {
          this.messages.push(messageObj);
        });

        this.getResponse(messageObj.id as string);
      });
  }

  public fetchMessages() {
    this.http
      .get<{
        messages: Message[];
      }>(`${environment.apiUrl}/messages/get-messages`)
      .subscribe((data) => {
        this.ngZone.run(() => {
          this.messages = data.messages;
        });
      });
  }

  public cancelResponse() {
    this.eventSource?.close();
    // this.typingMessage = '';
    this.ngZone.run(() => {
      this.isTypingMessage = false;
    });
  }

  public rateMessage(messageId: string, rate: number) {
    this.http
      .post<Message>(`${environment.apiUrl}/messages/rate-message`, {
        messageId,
        rate
      })
      .subscribe(() => {
        this.ngZone.run(() => {
          const mess = this.messages.find((p) => p.id === messageId);
          if (mess) {
            mess.rate = rate;
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.cancelResponse();
  }

  private getResponse(messageId: string) {
    const { eventSource, observable } = this.sseService.getStream<string>(
      `${environment.apiUrl}/messages/generate-response/${messageId}`,
      {
        eventName: 'message-sending-start',
        handler: ({ data }) => {
          this.ngZone.run(() => {
            const initMessage = JSON.parse(data);
            this.messages.push(initMessage);

            this.currentTypingMessageId = initMessage.id;
            this.isTypingMessage = true;
          });
        }
      },
      {
        eventName: 'data',
        handler: ({ data }) => {
          this.ngZone.run(() => {
            const messageIndex = this.messages.findIndex(
              (p) => p.id === this.currentTypingMessageId
            );
            const mess = this.messages[messageIndex];

            mess.content = `${mess.content} ${data}`;
          });
        }
      },
      {
        eventName: 'message-sending-end',
        handler: ({ data }) => {
          this.ngZone.run(() => {
            const messageIndex = this.messages.findIndex(
              (p) => p.id === this.currentTypingMessageId
            );
            this.messages[messageIndex] = JSON.parse(data);
            this.currentTypingMessageId = null;
            this.isTypingMessage = false;
          });
        }
      }
    );

    observable.subscribe();
    this.eventSource = eventSource;
  }
}
