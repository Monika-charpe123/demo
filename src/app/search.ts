import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timer, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'search',
  template: `
    <div>
      Search <input (input)="search($event)" />
      <div *ngFor="let word of searchWords$ | async">
        {{ word }}
      </div>
    </div>
  `,
})
export class SearchComponent implements OnInit {
  public searchWords$!: Observable<string[]>;

  private search$ = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  public ngOnInit() {
    this.searchWords$ = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((text) => (text ? this.loadWords(text) : of([]))),
      catchError(() => of([]))
    );
  }

  public search(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search$.next(input.value);
  }

  private loadWords(text: string): Observable<string[]> {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${text}&limit=100&namespace=0&format=json&origin=*`;

    return timer(1000).pipe(
      switchMap(() => this.httpClient.get<[string, string[]]>(url)),
      map((data) => data[1])
    );
  }
}
