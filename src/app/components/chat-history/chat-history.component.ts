import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ChatbotService} from '../../services/chatbot.service';
import {MessageSender} from '../../types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat-history',
  imports: [
    NgForOf,
    NgIf
  ],
  styles: `
    .history {
      display: flex;
      flex-direction: column;
      max-width: 1920px;
      margin: 0 auto;
    }
    .chat-bubble {
      display: inline-block;
      max-width: 800px;
      width: 100%;
      padding: 10px;
      border-radius: 10px;
    }
    .chat-bubble[data-align="right"] {
      text-align: right;
      color: white;
      background-color: darkcyan;
      margin-left: auto;
    }

    .chat-bubble[data-align="left"] {
      color: white;
      background-color: dimgray;
    }
  `,
  template: `
    <div class="history">
      <p [attr.data-align]="message.sender === MessageSender.User ? 'right' : 'left'" *ngFor="let message of chatbotService.messages" class="chat-bubble">{{message.content}}</p>

      <p *ngIf="!!chatbotService.typingMessage" class="chat-bubble" [attr.data-align]="'left'">{{chatbotService.typingMessage}}</p>
    </div>
  `
})

export class ChatHistoryComponent implements AfterViewInit {

  constructor(protected chatbotService : ChatbotService) {}

  ngAfterViewInit(): void {
    this.chatbotService.fetchMessages();
  }

  protected readonly MessageSender = MessageSender;
  protected readonly JSON = JSON;
}
