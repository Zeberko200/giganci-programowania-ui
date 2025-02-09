// signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SrStreamMessage } from '@/app/types';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  public async ensureConnection(hubUrl: string) {
    if (
      this.hubConnection == null ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      await this.startConnection(hubUrl);
    }
  }

  public async startConnection(hubUrl: string) {
    if (this.hubConnection != null) {
      this.hubConnection.stop().then(() => {
        console.log('Connection has been stopped!');
      });
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .build();

    await this.hubConnection.start();
  }

  public getStream<TRes>(
    methodName: string,
    payload: unknown[],
    next: (value: SrStreamMessage<TRes>) => void
  ) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('Connection is not established!');
    }

    const stream = this.hubConnection.stream<SrStreamMessage<TRes>>(
      methodName,
      ...payload
    );

    stream.subscribe({
      next,
      error: (err: Error) => console.error(err),
      complete: () => console.log('Stream has been closed!')
    });
  }

  public async stopConnection() {
    await this.hubConnection.stop();
  }
}
