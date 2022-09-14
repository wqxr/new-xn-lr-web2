import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { FieldType } from '@lr/ngx-formly';

@Component({
    templateUrl: './serial-invoicenumber-search.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: []
})
export class NumberInvoiceInputComponent extends FieldType implements OnInit {
    myClass = '';
    ctrl: AbstractControl;
    invoiceStart: '';
    invoiceEnd: '';
    @ViewChild('invoiceStartInput', { static: true }) invoiceStartInput: ElementRef;
    @ViewChild('invoiceEndInput', { static: true }) invoiceEndInput: ElementRef;


    ngOnInit() {
        if (!!this.formControl.value) {
            this.invoiceStartInput.nativeElement.value = JSON.parse(this.formControl.value).invoiceStart;
            this.invoiceEndInput.nativeElement.value = JSON.parse(this.formControl.value).invoiceEnd;
        }
        this.formControl.valueChanges.subscribe(x => {
            if (!x) {
                this.invoiceStartInput.nativeElement.value = '';
                this.invoiceEndInput.nativeElement.value = '';
            }
        });
    }
    getinvoiceStart(e) {
        this.invoiceStart = e.target.value;
        this.setFieldValue();
    }
    getinvoiceEnd(e) {
        this.invoiceEnd = e.target.value;
        this.setFieldValue();

    }
    private setFieldValue() {
        this.model[`${this.field.key}`] = JSON.stringify({ invoiceStart: this.invoiceStart, invoiceEnd: this.invoiceEnd });
        this.formControl.setValue(this.model[`${this.field.key}`]);
    }


}
