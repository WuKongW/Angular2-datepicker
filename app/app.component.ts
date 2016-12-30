import { QuickDateBar } from './components/datepicker.component';
import { Component } from '@angular/core';

@Component({
    selector: 'wk-app',
    template: `<main>
                <br />
                <h2>Simple Date Picker</h2>
                <div style="width: 240px;">
                    <wk-datepicker></wk-datepicker>
                </div>
                <br />
                <h2>Simple Date Picker with init Date</h2>
                <div style="width: 240px;">
                    <wk-datepicker [initDate]="firstDay"></wk-datepicker>
                </div>
                <br />
                <h2>Date Picker with quick date bar</h2>
                <div style="width: 240px;">
                    <wk-datepicker [quickDateBars]="quickDateBars"></wk-datepicker>
                </div>
                <br />
                <h2>Date Picker with quick date bar and default quick date</h2>
                <div style="width: 240px;">
                    <wk-datepicker [quickDateBars]="quickDateBars" [selectedQuickDateBar]="defaultQuickDate"></wk-datepicker>
                </div>
            </main>`,
    styles: [`
      main {
          height: 400px;
          font-size: 13px;
          margin: 0 200px;
          }
`]
})
export default class AppComponent {

    private quickDateBars: QuickDateBar[] = [];
    private defaultQuickDate: QuickDateBar;
    private today: Date = new Date();
    private firstDay: Date = new Date((this.today.getMonth() + 1) + '/01/' + this.today.getFullYear());

    ngOnInit() {
        this.quickDateBars.push(
            {
                'label': 'First Day of the Month',
                'value': 'FDOM',
                'date': this.firstDay
            }, {
                'label': 'First Half of the Month',
                'value': 'FHOM',
                'startDate': this.firstDay,
                'endDate': new Date((this.today.getMonth() + 1) + '/15/' + this.today.getFullYear())
            }
        );
        this.defaultQuickDate = this.quickDateBars[1];
    }
}
