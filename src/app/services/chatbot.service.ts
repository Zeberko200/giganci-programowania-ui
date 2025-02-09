import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message, SrStreamMessage } from '@/app/types';
import { environment } from '@/environment';
import { SignalRService } from '@/app/services/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService implements OnDestroy {
  public isTypingMessage = false;
  public messages: Message[] = [];

  private currentTypingMessageId: string | null = null;

  constructor(
    private signalRService: SignalRService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.signalRService
      .startConnection(`${environment.apiUrl}/ChatbotHub`)
      .then()
      .then(() => {
        console.log('Connection has been open!');
      });
  }

  async ngOnDestroy() {
    await this.cancelResponse();
  }

  public sendPromptAndStreamResponse(message: string) {
    this.http
      .post<Message>(`${environment.apiUrl}/api/messages/send-message`, {
        message
      })
      .subscribe((messageObj) => {
        this.ngZone.run(() => {
          this.messages.push(messageObj);

          this.getResponse(messageObj.id as string);
        });
      });
  }

  public fetchMessages() {
    this.http
      .get<{
        messages: Message[];
      }>(`${environment.apiUrl}/api/messages/get-messages`)
      .subscribe((data) => {
        this.ngZone.run(() => {
          this.messages = data.messages;
        });
      });
  }

  public async cancelResponse() {
    await this.signalRService.stopConnection();
    this.ngZone.run(() => {
      this.isTypingMessage = false;
    });
  }

  public rateMessage(messageId: string, rate: number) {
    this.http
      .post<Message>(`${environment.apiUrl}/api/messages/rate-message`, {
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

  private getResponse(messageId: string) {
    this.signalRService
      .ensureConnection(`${environment.apiUrl}/ChatbotHub`)
      .then(() => {
        this.signalRService.getStream<string>(
          'GenerateResponse',
          [messageId] as unknown[],
          (mess: SrStreamMessage<string>) => {
            this.ngZone.run(() => {
              switch (mess.type) {
                case 'init': {
                  this.messages.push(JSON.parse(mess.data));
                  this.currentTypingMessageId = JSON.parse(mess.data).id;
                  this.isTypingMessage = true;
                  break;
                }
                case 'data': {
                  const messageIndex = this.messages.findIndex(
                    (p) => p.id === this.currentTypingMessageId
                  );
                  const message = this.messages[messageIndex];
                  message.content = `${message.content} ${mess.data}`;
                  break;
                }
                case 'complete': {
                  const messageIndex = this.messages.findIndex(
                    (p) => p.id === this.currentTypingMessageId
                  );
                  this.messages[messageIndex] = JSON.parse(mess.data);
                  this.currentTypingMessageId = null;
                  this.isTypingMessage = false;
                  break;
                }
              }
            });
          }
        );
      });
  }
}
