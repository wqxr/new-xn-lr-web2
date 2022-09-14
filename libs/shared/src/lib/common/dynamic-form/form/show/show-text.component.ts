import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';

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
@DynamicForm({ type: 'text', formModule: 'default-show' })
export class TextComponent implements OnInit, AfterViewInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;

    label = '未填写';

    constructor(private er: ElementRef, ) {
    }

    ngOnInit() {
        this.label = this.row.data;
    }
    ngAfterViewInit(): void {
        if (this.row && this.row.flowId === 'sub_dragon_book_change'
            && (this.row.checkerId === 'projectName')) {
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
