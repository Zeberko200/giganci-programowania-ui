import { AfterViewInit, Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ChatbotService } from '@/app/services/chatbot.service';
import { ChatBubbleComponent } from '@/app/components/chat-bubble/chat-bubble.component';

@Component({
  selector: 'app-chat-history',
  imports: [NgForOf, ChatBubbleComponent],
  styles: `
    .history {
      display: flex;
      flex-direction: column;
      max-width: 1080px;
      margin: 0 auto;
    }
  `,
  template: `
    <div class="history">
      <app-chat-bubble
        *ngFor="let message of chatbotService.messages"
        [message]="message"
      />
    </div>
  `
})
export class ChatHistoryComponent implements AfterViewInit {
  constructor(protected chatbotService: ChatbotService) {}

  ngAfterViewInit(): void {
    this.chatbotService.fetchMessages();
  }
}
