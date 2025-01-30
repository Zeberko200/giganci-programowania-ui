import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface SseEvent<T> {
  eventType: string;
  data: T;
}

interface SseEventHandler<T> {
  eventName: string;
  handler: (data: MessageEvent<T>) => void;
}

@Injectable({
  providedIn: 'root'
})
export class SseService {
  public getStream<T>(
    url: string,
    ...handlers: SseEventHandler<T>[]
  ): { observable: Observable<SseEvent<T>>; eventSource: EventSource } {
    const eventSource = new EventSource(url);

    const observable = new Observable<SseEvent<T>>(() => {
      handlers.forEach(({ eventName, handler }) => {
        eventSource.addEventListener(eventName, handler);
      });

      eventSource.onmessage = (event: MessageEvent) => {
        handlers
          .filter((h) => h.eventName === 'data')
          .forEach((h) => h.handler(event));
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
        handlers.forEach(({ eventName, handler }) => {
          eventSource.removeEventListener(eventName, handler);
        });
      };
    });

    return { observable, eventSource };
  }
}
