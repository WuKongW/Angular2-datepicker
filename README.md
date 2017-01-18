# Angular2-datepicker
This is one sample for simple date picker.

## How to use
>
1. install
 ```
   npm install ng2-wk-date-picker --save-dev
 ```
2. configure with resource loader and import into your project
e.g. SystemJS
```
    System.config({
    map: {
        'ng2-wk-date-picker': 'node_modules/ng2-wk-date-picker'
    },
    packages: {
        'ng2-wk-date-picker': {
            main: 'index.js'
        }
    }
    });
```
```
 import { Ng2WkDatePickerModule } from 'ng2-wk-date-picker';
  @NgModule({
    imports: [
        BrowserModule,
        Ng2WkDatePickerModule
    ],
    declarations: [],
    bootstrap: [],
  })
  export class AppModule { }
```

## start up the demo
1. npm install
2. npm start
