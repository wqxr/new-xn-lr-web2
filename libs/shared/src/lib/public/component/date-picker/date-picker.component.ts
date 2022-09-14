import {
    AfterViewInit, Component,
    ElementRef,





    EventEmitter, Input,
    OnDestroy,
    Output, ViewChild
} from '@angular/core';

declare var $: any;
declare const moment: any;

@Component({
    selector: 'xn-date-picker',
    template:
        `<input #input type="text"
            [placeholder]="placeholder"
            maxlength="8"
            [value]="value"
            [disabled]="disabled"
            data-provide="datepicker"
            class="form-control xn-input-font xn-input-border-radius">`
})
export class DatePickerComponent implements AfterViewInit, OnDestroy {
    @ViewChild('input') input: ElementRef;

    @Input() placeholder = '';
    @Input() options: any;
    @Input() value = '';
    @Input() disabled = false;
    @Output() changeDate = new EventEmitter();
    @Output() hide = new EventEmitter();
    @Output() show = new EventEmitter();

    private instance: any;

    ngAfterViewInit() {
        this.instance = $(this.input.nativeElement).datepicker(this.options || {});

        this.instance.on('changeDate', e => {
            console.log('eee=<', e);
            e.preventDefault();
            this.changeDate.emit(e);
        });

        this.instance.on('hide', e => this.hide.emit(e));
        this.instance.on('show', e => this.show.emit(e));
    }

    update(dateStr: string) {
        if (this.instance) {
            this.instance.datepicker('update', dateStr);
        }
    }

    ngOnDestroy() {
        if (this.instance) {
            this.instance.off();
        }
    }
}
