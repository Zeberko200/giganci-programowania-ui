import {Component, viewChild} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ChatbotService} from '../../services/chatbot.service';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-prompt-bar',
  imports: [
    MatInput,
    MatFormField,
    MatButton,
    FormsModule
  ],
  template: `
    <form #form="ngForm" (submit)="onSubmit(form)">
      <mat-form-field class="example-full-width">
        <input matInput placeholder="Type message..." name="prompt" ngModel>
      </mat-form-field>
      <button mat-button>Wyślij</button>
    </form>
  `
})

export class PromptBarComponent {
  constructor(protected chatbotService: ChatbotService) {
  }

  public onSubmit(ev: NgForm) {
    const prompt = ev.value.prompt;
    if(!prompt) return;

    this.chatbotService.sendPromptAndGetResponse(prompt);

    ev.reset();
  }
}
