import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat';
import { SearchComponent } from './search';
import { QueueComponent } from './queue';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'queue', component: QueueComponent },
  { path: 'chat', component: ChatComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/search' }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [AppComponent, SearchComponent, QueueComponent, ChatComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
