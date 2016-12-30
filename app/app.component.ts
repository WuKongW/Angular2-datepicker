import {Component} from '@angular/core';

@Component({
  selector: 'wk-app',
  template: `<main>
                <div style="width: 240px;">
                    <wk-datepicker></wk-datepicker>
                </div>
            </main>`,
  styles: [`
      main {
          height: 400px;
          text-align: center;
          }
`]
})
export default class AppComponent { }
