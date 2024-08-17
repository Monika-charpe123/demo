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
    <div class="search-container">
      <h2>Search</h2>
      <input (input)="search($event)" placeholder="Type to search..." />
      <div *ngFor="let word of searchWords$ | async" class="search-result">
        {{ word }}
      </div>
    </div>
  `,
  styles: [
    `
      .search-container {
        margin: 20px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        max-width: 400px;
        background-color: #f9f9f9;
      }

      h2 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #333;
      }

      input {
        width: 100%;
        padding: 8px;
        font-size: 16px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .search-result {
        padding: 5px;
        border-bottom: 1px solid #eee;
        color: #555;
      }

      .search-result:last-child {
        border-bottom: none;
      }
    `,
  ],
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
