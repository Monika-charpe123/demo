import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { ChatComponent } from './chat';
import { SearchComponent } from './search';
import { QueueComponent } from './queue';
// Ensure correct path if needed

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [AppComponent, ChatComponent, SearchComponent, QueueComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
