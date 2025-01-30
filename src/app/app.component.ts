import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {PromptBarComponent} from './components/prompt-bar/prompt-bar.component';
import {ChatHistoryComponent} from './components/chat-history/chat-history.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCard, MatCardContent, MatCardHeader, MatCardTitle, PromptBarComponent, ChatHistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GP-Client';
}
