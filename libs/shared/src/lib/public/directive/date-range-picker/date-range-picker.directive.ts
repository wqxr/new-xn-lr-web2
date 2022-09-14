import { Directive, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValueDiffers, ElementRef, OnDestroy, DoCheck } from '@angular/core';
import { DaterangepickerConfigService } from './config.service';

@Directive({
    selector: '[daterangepicker]',
})
export class DaterangepickerDirective implements AfterViewInit, OnDestroy, DoCheck {

    private activeRange: any;
    private targetOptions: any = {} as any;
    private _differ: any = {} as any;

    public datePicker: any;

    // daterangepicker properties
    @Input() options: any = {} as any;

    // daterangepicker events
    @Output() selected = new EventEmitter();
    @Output() cancelDaterangepicker = new EventEmitter();
    @Output() applyDaterangepicker = new EventEmitter();
    @Output() hideCalendarDaterangepicker = new EventEmitter();
    @Output() showCalendarDaterangepicker = new EventEmitter();
    @Output() hideDaterangepicker = new EventEmitter();
    @Output() showDaterangepicker = new EventEmitter();

    constructor(
        public input: ElementRef,
        private config: DaterangepickerConfigService,
        differs: KeyValueDiffers
    ) {
        this._differ.options = differs.find(this.options).create();
        this._differ.settings = differs.find(this.config.settings).create();
    }

    ngAfterViewInit() {
        this.config.embedCSS();
        this.render();
        this.attachEvents();
    }

    render() {
        this.targetOptions = this.merge(this.config.settings, this.options);

        ($(this.input.nativeElement) as any).daterangepicker(this.targetOptions, this.callback.bind(this));

        this.datePicker = ($(this.input.nativeElement) as any).data('daterangepicker');
    }

    attachEvents() {
        $(this.input.nativeElement).on('cancel.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.cancelDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('apply.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.applyDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('hideCalendar.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.hideCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('showCalendar.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.showCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('hide.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.hideDaterangepicker.emit(event);
            }
        );

        $(this.input.nativeElement).on('show.daterangepicker',
            (e: any, picker: any) => {
                const event = { event: e, picker };
                this.showDaterangepicker.emit(event);
            }
        );
    }

    private callback(start?: any, end?: any, label?: any): void {
        this.activeRange = {
            start,
            end,
            label
        };

        this.selected.emit(this.activeRange);
    }

    private merge(...objs) {
        const result = {} as any;

        [...objs].reduce(
            (acc, obj) =>
                Object.keys(obj).reduce((a, k) => {
                    if (acc.hasOwnProperty(k)) {
                        acc[k] = Array.isArray(acc[k])
                            ? [].concat(acc[k]).concat(obj[k])
                            : { ...acc[k], ...obj[k] };
                    } else {
                        acc[k] = obj[k];
                    }

                    return acc;
                }, {}),
            result
        );

        return result;
    }

    destroyPicker() {
        try {
            ($(this.input.nativeElement) as any).data('daterangepicker').remove();
        } catch (e) {
            console.log(e.message);
        }
    }

    ngOnDestroy() {
        this.destroyPicker();
    }

    ngDoCheck() {
        const optionsChanged = this._differ.options.diff(this.options);
        const settingsChanged = this._differ.settings.diff(this.config.settings);

        if (optionsChanged || settingsChanged) {
            this.render();
            this.attachEvents();
            if (this.activeRange && this.datePicker) {
                this.datePicker.setStartDate(this.activeRange.start);
                this.datePicker.setEndDate(this.activeRange.end);
            }
        }
    }
}
