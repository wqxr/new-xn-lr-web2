import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
@Component({
    template: `
    <div style='width:100%' [ngClass]="{'input-group': row.options?.unit}">
        <div class="form-control xn-input-font xn-input-border-radius">
            <div class="label-line">
                {{label}}
            </div>
        </div>
        <span class="input-group-addon" *ngIf="row.options?.unit">{{row.options?.unit}}</span>
    </div>
    `,
})
@DynamicForm({ type: 'number-input', formModule: 'default-show' })
export class NumberInputShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '未填写';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (this.row && this.row.flowId === 'sub_dragon_book_change'
            && (this.row.checkerId === 'receive' || this.row.checkerId === 'changePrice')) {
            this.label = this.row.data !== undefined && this.row.data !== '' ? XnUtils.formatMoney(this.row.data.toString()) : '';
        } else if (this.row) {
            this.label = this.row.data;
        }
    }

    ngAfterViewInit(): void {
        if (this.row && this.row.flowId === 'sub_dragon_book_change'
            && (this.row.checkerId === 'receive' || this.row.checkerId === 'changePrice')) {
            this.row.data !== undefined && this.row.data !== '' ? this.showRow() : this.hideRow();
        }
    }

    private showRow(): void {
        $(this.er.nativeElement).parents('.form-group').show();
    }

    private hideRow(): void {
        $(this.er.nativeElement).parents('.form-group').hide();
    }
}
