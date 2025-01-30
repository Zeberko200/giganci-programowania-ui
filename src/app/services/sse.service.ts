import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

type SseEvent<T> = {
  eventType: string;
  data: T;
}

type SseEventHandler<T> = {
  eventName: string,
  handler: (data: MessageEvent<T>) => void
}

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() { }

  public getStream<T>(url: string, ...handlers: SseEventHandler<T>[]): Observable<SseEvent<T>> {
    return new Observable<SseEvent<T>>(obs => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event: MessageEvent) => {
        handlers.filter(h => h.eventName === 'data').forEach(h => h.handler(event));
      }

      handlers.forEach(({eventName, handler}) => {
        eventSource.addEventListener(eventName, handler);
      })

      eventSource.onerror = (error) => {
        eventSource.close();
      }

      return () => {
        eventSource.close();
        handlers.forEach(({eventName, handler}) => {
          eventSource.removeEventListener(eventName, handler);
        });
      }
    })
  }
}
