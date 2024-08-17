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
    <div>
      Chat
      <button (click)="setChannel('first')">channel 1</button>
      <button (click)="setChannel('second')">channel 2</button>
      <br />
      channel: {{ currentChannel$ | async }}
      <br />
      <input [value]="text" (input)="onInput($event)" />
      <button (click)="send()">send</button>
      <div *ngFor="let message of currentMessages$ | async">
        {{ message.id }}: {{ message.text }}
      </div>
    </div>
  `,
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
