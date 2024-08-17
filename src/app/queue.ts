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
    <div>
      Queue
      <button (click)="tick()">tick</button>
      <button (click)="reset()">reset</button>
      <div *ngIf="counter$ | async as counter">
        {{ counter[0] }}: {{ counter[1] }}
      </div>
    </div>
  `,
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
