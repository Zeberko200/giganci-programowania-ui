import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from '@angular/material/card';
import { PromptBarComponent } from '@/app/components/prompt-bar/prompt-bar.component';
import { ChatHistoryComponent } from '@/app/components/chat-history/chat-history.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatCard,

    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    PromptBarComponent,
    ChatHistoryComponent,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <h1>Giganci Programowania</h1>
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-chat-history />
        <app-prompt-bar />
      </mat-card-content>
    </mat-card>
    <router-outlet />
  `
})
export class AppComponent {
  title = 'GP-Client';
}
