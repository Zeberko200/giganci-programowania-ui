import { Component } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ChatbotService } from '@/app/services/chatbot.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-prompt-bar',
  imports: [MatInput, MatFormField, MatButton, FormsModule, MatFormFieldModule],
  styles: `
    form {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
    }

    .input {
      width: 100%;
    }
  `,
  template: `
    <form #form="ngForm" (submit)="onSubmit(form)">
      <mat-form-field class="input">
        <textarea
          matInput
          placeholder="Type message..."
          name="prompt"
          ngModel
        ></textarea>
      </mat-form-field>
      @if (chatbotService.isTypingMessage) {
        <button
          mat-button
          type="button"
          (click)="this.chatbotService.cancelResponse()"
        >
          Reset
        </button>
      } @else {
        <button mat-button>Wyślij</button>
      }
    </form>
  `
})
export class PromptBarComponent {
  protected readonly NgForm = NgForm;

  constructor(protected chatbotService: ChatbotService) {}

  public onSubmit(ev: NgForm) {
    const prompt = ev.value.prompt;
    if (!prompt) return;

    this.chatbotService.sendPromptAndStreamResponse(prompt);

    ev.reset();
  }
}
