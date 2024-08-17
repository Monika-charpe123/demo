import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, range, timer } from 'rxjs';
import {
  concatMap,
  filter,
  map,
  scan,
  startWith,
  switchMap,
  zip,
} from 'rxjs/operators';

@Component({
  selector: 'queue',
  template: `
    <div class="queue-container">
      <h2>Queue</h2>
      <div class="button-group">
        <button (click)="tick()">Tick</button>
        <button (click)="reset()">Stop</button>
      </div>
      <div *ngIf="counter$ | async as counter" class="counter-display">
        Step {{ counter[0] }}: Count {{ counter[1] }}
      </div>
    </div>
  `,
  styles: [
    `
      .queue-container {
        margin: 20px;
        padding: 20px;
        border: 2px solid #ccc;
        border-radius: 8px;
        background-color: #f2f2f2;
        max-width: 400px;
      }

      h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
      }

      .button-group {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      button {
        padding: 10px 20px;
        font-size: 16px;
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

      .counter-display {
        font-size: 18px;
        color: #555;
        padding: 10px;
        border-radius: 4px;
        background-color: #e6e6e6;
        text-align: center;
      }
    `,
  ],
})
export class QueueComponent implements OnInit {
  public counter$!: Observable<[number, number]>;

  private reset$ = new Subject<void>();
  private queue$ = new Subject<void>();

  public ngOnInit() {
    this.counter$ = this.reset$.pipe(
      startWith(null),
      switchMap(() =>
        this.queue$.pipe(
          scan((step) => step + 1, 0),
          concatMap((step) => this.countingRange(step)),
          filter((value) => value !== null) // Ensure non-null values
        )
      )
    );
  }

  public reset(): void {
    this.reset$.next();
  }

  public tick(): void {
    this.queue$.next();
  }

  private countingRange(step: number): Observable<[number, number]> {
    return range(1, 10).pipe(
      zip(timer(300, 300), (x, y) => [x, y] as [number, number]),
      map((value) => [step, value[1]])
    );
  }
}
