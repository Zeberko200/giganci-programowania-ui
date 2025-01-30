import { Component, Input } from '@angular/core';
import { Message, MessageSender } from '@/app/types';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { ChatbotService } from '@/app/services/chatbot.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent
} from '@angular/material/card';

@Component({
  selector: 'app-chat-bubble',
  imports: [
    MatIcon,
    NgIf,
    MatIconButton,
    MatCard,
    MatCardContent,
    MatCardActions
  ],
  styles: `
    .chat-bubble {
      max-width: 800px;
      width: 100%;
      margin: 10px 0;

      &[data-align='right'] {
        text-align: right;
        color: white;
        background-color: darkcyan;
        margin-left: auto;
      }

      &[data-align='left'] {
        color: white;
        background-color: dimgray;
      }

      button[data-checked='false'] {
        color: white;
      }

      button[data-checked='true'] {
        color: darkcyan;
      }
    }
  `,
  template: `
    <mat-card
      appearance="outlined"
      [attr.data-align]="
        message.sender === MessageSender.User ? 'right' : 'left'
      "
      class="chat-bubble"
    >
      <mat-card-content>{{ message.content }}</mat-card-content>
      <mat-card-actions *ngIf="message.sender === MessageSender.Chatbot">
        <button
          mat-icon-button
          aria-label="I like it"
          [attr.data-checked]="message.rate === 2"
          (click)="rate(2)"
        >
          <mat-icon>thumb_up</mat-icon>
        </button>
        <button
          mat-icon-button
          aria-label="Discasting :("
          [attr.data-checked]="message.rate === 1"
          (click)="rate(1)"
        >
          <mat-icon>thumb_down</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `
})
export class ChatBubbleComponent {
  @Input() message!: Message;
  protected readonly MessageSender = MessageSender;
  protected readonly JSON = JSON;

  constructor(protected chatbotService: ChatbotService) {}

  public rate(rating: number) {
    this.chatbotService.rateMessage(
      this.message.id as string,
      this.message.rate === rating ? 0 : rating
    );
  }
}
