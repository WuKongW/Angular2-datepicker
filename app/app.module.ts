import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';

import AppComponent from './app.component';
import { DatepickerComponent } from './components/datepicker.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [AppComponent, DatepickerComponent],
    bootstrap: [AppComponent],
})

export class AppModule { }
