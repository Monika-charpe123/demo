import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular 16';

  public searchWords$!: Observable<string[]>;

  private data = ['aa', 'ab', 'abc', 'bb', 'bc', 'bcd', 'cc', 'cd', 'cde'];

  private search$ = new Subject<string>();

  ngOnInit() {
    this.searchWords$ = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((text) => (text ? this.loadWords(text) : of([]))),
      catchError(() => of([]))
    );
  }

  public search(text: string): void {
    this.search$.next(text);
  }

  private loadWords(text: string): Promise<string[]> {
    console.log(`>>> loading words for "${text}"`);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        const words = this.data.filter((word) => word.startsWith(text));
        resolve(words);
      }, 500);
    });
  }
}
