import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    moduleId: 'app/components/',
    selector: 'wk-datepicker',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['datepicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent implements OnInit {
    @Input() initDate: Date | string;
    @Input() isHidden: boolean = true;
    @Input() minDate: Date | string = '01/01/1900';
    @Input() maxDate: Date | string = '12/31/2117';
    @Input() disabledDates: (Date | string)[];
    @Input() availableDates: (Date | string)[];
    @Input() displayDateType: boolean;
    @Input() quickDateBars: QuickDateBar[];
    @Input() selectedQuickDateBar: QuickDateBar;
    @Output() selected_date: EventEmitter<any> = new EventEmitter<any>();

    
    private displayDate: string = null;
    private dates: Array<Day[]> = [[]];
    private titleYear: number;
    private titleMonth: number;
    private pickerTitle: string;
    private today: Date;
    private monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private monthFullName: string[] =
    ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private monthName: string[] =
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    private _minDate: Date = new Date('01/01/1900');
    private _maxDate: Date = new Date('12/31/2117');
    private _disabledDates: (Date | string)[];
    private _availableDates: (Date | string)[];
    private minYear: number;
    private minMonth: number;
    private maxYear: number;
    private maxMonth: number;

    private selectedDate: SelectedDate;
    private outputDate: OutputDate;
    private startDate: Date;
    private endDate: Date;

    private hasSelectedBar: boolean;
    private hasInitDate: boolean;
    private isInited: boolean;

    constructor() { 
        this.createEmptyDatePicker();
    }

    ngOnInit() {
        if (!this.isInited) {
            this.initDatePicker(new Date());
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedQuickDateBar']) this.hasSelectedBar = true;
        if (changes['initDate']) this.hasInitDate = true;

        if (changes['selectedQuickDateBar'] && changes['selectedQuickDateBar'].currentValue) {
            if (!this.hasInitDate && !this.isInited) {
                this.initDatePicker(new Date());
            }

            if (this.hasInitDate) {
                this.setAvailableDates(this.selectedQuickDateBar);
            } else {
                this.selectBar(this.selectedQuickDateBar);
            }
        }
        if (changes['maxDate'] && changes['maxDate'].currentValue) {
            this._maxDate = new Date(this.maxDate);
        }
        if (changes['minDate'] && changes['minDate'].currentValue) {
            this._minDate = new Date(this.minDate);
        }
        if (changes['availableDates'] && changes['availableDates'].currentValue) {
            this._availableDates = this.availableDates;
        }
        if (changes['disabledDates'] && changes['disabledDates'].currentValue) {
            this._disabledDates = this.disabledDates;
        }
        if (changes['initDate'] && changes['initDate'].currentValue) {
            let _initDate: Date = new Date(this.initDate);
            this.initDatePicker(_initDate);
            this.selectionEmitter(new Day(_initDate.getDate()));
        }
    }

    private createEmptyDatePicker(): void {
        for (let i = 0; i < 6; i++) {
            this.dates.push([]);
            for (let j = 0; j < 7; j++) {
                this.dates[i].push();
            }
        }
    }

    private initDatePicker(date: Date): void {
        let today: Date = date;
        this.titleYear = today.getFullYear();
        this.titleMonth = today.getMonth() + 1;

        this.pickerTitle = this.renderTitle();
        this.selectedDate = new SelectedDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
        this.calCalendar();
        this.initInput();

        if (!this.hasInitDate && !this.hasSelectedBar) {
            this.selectionEmitter(new Day(today.getDate()));
        }
        this.isInited = true;
    }

    private selectionEmitter(d: Day): void {
        this.isHidden = true;
        this.startDate = new Date(this.titleMonth + '/' + d.date + '/' + this.titleYear);
        this.endDate = null;
        this.selectedDate = new SelectedDate(this.titleYear, this.titleMonth, d.date);
        this.displayDate = (this.displayDateType && this.selectedQuickDateBar ? this.selectedQuickDateBar.value : '')
            + (this.selectedDate.day < 10 ? ('0' + this.selectedDate.day) : this.selectedDate.day)
            + '-' + this.monthName[this.selectedDate.month - 1] + '-' + this.selectedDate.year;

        this.outputEvent();
    }

    private selectDate(d: Day): void {
        if (!d.isDisabled) {
            if (d.num > 0) this.increaseMonth();
            if (d.num < 0) this.decreaseMonth();
            this.selectionEmitter(d);
        }
    }

    private isDateSelected(d: Day): boolean {
        const date: Date = new Date((this.titleMonth + (d.num | 0)) + '/' + d.date + '/' + this.titleYear);
        d.isSelected = (this.startDate && this.startDate.getTime() === date.getTime()) || (this.endDate && this.endDate.getTime() === date.getTime());
        d.isInRange = (this.startDate && this.startDate.getTime() < date.getTime()) && (this.endDate && this.endDate.getTime() > date.getTime());
        d.isDisabled =  this.isDateDisbalbed(date);
        return d.isSelected;
    }

    private isDateDisbalbed(date: Date): boolean {
        if (date.getTime() > new Date(this.maxDate).getTime() || date.getTime() < new Date(this.minDate).getTime()) {
            return true;
        }
        if (this.disabledDates && this.disabledDates.length > 0
            && this.disabledDates.filter((disabledDate: Date|string) => date.getTime() === new Date(disabledDate).getTime()).length > 0) {
                return true;
            }
        if (this.availableDates && this.availableDates.length > 0
            && this.availableDates.filter((availableDate: Date|string) => date.getTime() === new Date(availableDate).getTime()).length === 0) {
                return true;
            }
        return false;
    }

    /**
     * Formate displaying month to full name
     */
    private renderTitle(): string {
        return this.monthFullName[this.titleMonth - 1] + ' ' + this.titleYear;
    }

    private initInput(): void {
        this.maxYear = new Date(this.maxDate.toString()).getFullYear();
        this.maxMonth = new Date(this.maxDate.toString()).getMonth() + 1;
        this.minYear = new Date(this.minDate.toString()).getFullYear();
        this.minMonth = new Date(this.minDate.toString()).getMonth() + 1;
    }

    private calCalendar(): void {
        this.clearCalendar();

        let startTime: Date = new Date(this.titleMonth + '/01/' + this.titleYear);
        let startDay: number = startTime.getDay();
        let monthDays: number = this.calMonthEndDay(this.titleYear, this.titleMonth, 0);

        for (let i = 0, k = 1, l = 1; i < 6; i++) {
            if (i === 0) {
                for (let j = 0; j < 7; j++) {
                    if (j < startDay) {
                        let lastMonthEndDay: number = this.calMonthEndDay(this.titleYear, this.titleMonth, -1);
                        let lastDay: number = lastMonthEndDay - startDay + j + 1;
                        this.dates[i][j] = new Day(lastDay, -1, this.isHoliday(this.titleYear, this.titleMonth, lastDay, -1), false, this.isSelectedDay(this.titleYear, this.titleMonth, lastDay, -1));
                    } else {
                        this.dates[i][j] = new Day(k, 0, this.isHoliday(this.titleYear, this.titleMonth, k, 0), true, this.isSelectedDay(this.titleYear, this.titleMonth, k, 0));
                        k++;
                    }
                }
            } else {
                for (let j = 0; j < 7; j++ , k++) {
                    if (k > monthDays) {
                        this.dates[i][j] = new Day(l, 1, this.isHoliday(this.titleYear, this.titleMonth, l, 1), false, this.isSelectedDay(this.titleYear, this.titleMonth, l, 1));
                        l++;
                    } else {
                        this.dates[i][j] = new Day(k, 0, this.isHoliday(this.titleYear, this.titleMonth, k, 0), true, this.isSelectedDay(this.titleYear, this.titleMonth, k, 0));
                    }
                }
            }
        }
    }

    private increaseMonth(): void {
        this.titleMonth++;
        if (this.titleMonth === 13) {
            this.titleYear++;
            this.titleMonth = 1;
        }
        this.pickerTitle = this.renderTitle();
        this.calCalendar();
    }

    private decreaseMonth(): void {
        this.titleMonth--;
        if (this.titleMonth === 0) {
            this.titleYear--;
            this.titleMonth = 12;
        }
        this.pickerTitle = this.renderTitle();
        this.calCalendar();
    }

    private isSelectedDay(y: number, m: number, d: number, num: number): boolean {
        let year: number = y;
        let month: number = m + num;
        if (month === 0) {
            year--;
            month = 12;
        }
        if (month === 13) {
            year++;
            month = 1;
        }

        if (year !== this.selectedDate.year) return false;
        if (month !== this.selectedDate.month) return false;
        if (d !== this.selectedDate.day) return false;
        return true;
    }

    private isHoliday(y: number, m: number, d: number, num: number): boolean {
        let year: number = y;
        let month: number = m + num;
        if (month === 0) {
            year--;
            month = 12;
        }
        if (month === 13) {
            year++;
            month = 1;
        }
        let day = new Date(month + '/' + d + '/' + year);
        if (day.getDay() === 0 || day.getDay() === 6) return true;
        return false;
    }

    private calMonthEndDay(y: number, m: number, num: number): number {
        let year: number = y;
        let month: number = m + num;
        if (month === 0) {
            year--;
            month = 12;
        }
        if (month === 13) {
            year++;
            month = 1;
        }

        return (year % 4 === 0) && (month === 2) ? this.monthDays[month - 1] + 1 : this.monthDays[month - 1];
    }

    private clearCalendar(): void {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                this.dates[i][j] = null;
            }
        }
    }

    private resetCalendar(year: number, month: number): void {
        this.titleMonth = month;
        this.titleYear = year;
        if (this.titleMonth === 13) {
            this.titleYear++;
            this.titleMonth = 1;
        }
        if (this.titleMonth === 0) {
            this.titleYear--;
            this.titleMonth = 12
        }
        this.pickerTitle = this.renderTitle();
        this.calCalendar();
    }

    private selectBar(bar: QuickDateBar): void {
        if (bar.startDate && bar.endDate) {
            this.startDate = bar.startDate;
            this.endDate = bar.endDate;
            this.displayDate = (this.displayDateType ? bar.value : '')
                + this.renderDisplayDate(this.startDate) + ' - ' + this.renderDisplayDate(this.endDate);
        } else {
            this.startDate = bar.date || bar.startDate || bar.endDate;
            this.displayDate = (this.displayDateType ? bar.value : '') + this.renderDisplayDate(this.startDate);
        }

        this.isHidden = true;
        this.resetCalendar(this.startDate.getFullYear(), this.startDate.getMonth() + 1);
        this.selectedQuickDateBar = bar;
        this.outputEvent();
    }
    private setAvailableDates(bar: QuickDateBar): void {
        this.maxDate = (bar && bar.maxDate) ? bar.maxDate : this._maxDate;
        this.minDate = (bar && bar.minDate) ? bar.minDate : this._minDate;
        this.disabledDates = (bar && bar.disabledDates) ? bar.disabledDates : this._disabledDates;
        this.availableDates = (bar && bar.availableDates) ? bar.availableDates : this.availableDates;
        this.initInput();
    }

    private isBarSelected(bar: QuickDateBar): boolean {
        return this.selectedQuickDateBar === bar;
    }

    private renderDisplayDate(date: Date): string {
        if (date)
            return (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '-' + this.monthName[date.getMonth()] + '-' + date.getFullYear();
    }

    private toggleCalendar(isHidden?: boolean): void {
        this.isHidden = isHidden ? isHidden : !this.isHidden;
        if (this.isHidden) this.resetCalendar(this.startDate.getFullYear(), this.startDate.getMonth() + 1);
    }

    private outputEvent(): void {
        this.outputDate = {
            date: this.startDate,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.selectedQuickDateBar
        };
        this.selected_date.emit(this.outputDate);
    }
}

class Day {
    constructor(public date: number, public num?: number, public isHoliday?: boolean, public isInMonth?: boolean, public isSelected?: boolean, public isInRange?: boolean, public isDisabled?: boolean) { }
}

class SelectedDate {
    constructor(public year: number, public month: number, public day: number) { }
}

export interface QuickDateBar {
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: (Date | string)[];
    availableDates?: (Date | string)[];
    label?: string;
    value?: string;
    monthly?: true;
    children?: QuickDateBar;
}

export interface OutputDate {
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    dateType?: QuickDateBar;
}