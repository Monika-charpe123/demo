import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  scan,
  startWith,
  switchMap,
  withLatestFrom,
  map,
} from 'rxjs/operators';

interface IMessage {
  id: string;
  text: string;
}

interface IChannelsMessages {
  [channel: string]: IMessage[];
}

@Component({
  selector: 'chat',
  template: `
    <div class="chat-container">
      <h2>Chat</h2>
      <div class="channel-buttons">
        <button (click)="setChannel('first')">Channel 1</button>
        <button (click)="setChannel('second')">Channel 2</button>
      </div>
      <div class="channel-info">
        Current Channel: {{ currentChannel$ | async }}
      </div>
      <div class="message-input">
        <input
          [value]="text"
          (input)="onInput($event)"
          placeholder="Type your message..."
        />
        <button (click)="send()">Send</button>
      </div>
      <div class="messages-list">
        <div *ngFor="let message of currentMessages$ | async" class="message">
          <span class="message-id">{{ message.id }}:</span>
          <span class="message-text">{{ message.text }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chat-container {
        margin: 20px;
        padding: 20px;
        border: 2px solid #ccc;
        border-radius: 8px;
        background-color: #fafafa;
        max-width: 500px;
      }

      h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
      }

      .channel-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      .channel-info {
        font-size: 16px;
        margin-bottom: 20px;
        color: #007bff;
      }

      .message-input {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      input {
        flex: 1;
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      input:focus {
        outline: none;
        border-color: #007bff;
      }

      button {
        padding: 8px 16px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: #0056b3;
      }

      .messages-list {
        max-height: 200px;
        overflow-y: auto;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f9f9f9;
      }

      .message {
        padding: 5px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 5px;
      }

      .message:last-child {
        border-bottom: none;
      }

      .message-id {
        font-weight: bold;
        color: #333;
      }

      .message-text {
        margin-left: 5px;
        color: #555;
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  public text = '';
  public currentChannel$!: Observable<string>;
  public currentMessages$!: Observable<IMessage[]>;

  private channel$ = new BehaviorSubject<string>('first');
  private messages$ = new Subject<IMessage>();

  public ngOnInit() {
    const channel$ = this.channel$.pipe(distinctUntilChanged());

    this.currentChannel$ = channel$;

    this.currentMessages$ = this.messages$.pipe(
      withLatestFrom(channel$),
      scan(
        (channelsMessages, [message, channel]) =>
          this.addChannelMessage(channelsMessages, message, channel),
        {} as IChannelsMessages
      ),
      startWith<IChannelsMessages>({}),
      switchMap((channelsMessages) =>
        channel$.pipe(map((channel) => channelsMessages[channel] || []))
      )
    );
  }

  public send(): void {
    const message: IMessage = {
      id: Date.now().toString(),
      text: this.text,
    };

    this.messages$.next(message);
    this.text = '';
  }

  public setChannel(channel: string): void {
    this.channel$.next(channel);
  }

  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.text = input.value;
  }

  private addChannelMessage(
    channelsMessages: IChannelsMessages,
    message: IMessage,
    channel: string
  ): IChannelsMessages {
    return {
      ...channelsMessages,
      [channel]: [...(channelsMessages[channel] || []), message],
    };
  }
}
