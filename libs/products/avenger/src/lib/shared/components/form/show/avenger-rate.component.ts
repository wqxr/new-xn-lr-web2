import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table-hover table table-bordered file-row-table">
        <tr>
            <ng-container *ngFor='let sub of items;let i=index'>
            <td style="width: 130px">{{sub.name}}</td>
            <td class='readonlystyle' *ngIf='i===0'>{{sub.value}}%</td>
            <td class='readonlystyle' *ngIf='i===1'>{{sub.value}}天</td>
            <td class='readonlystyle' *ngIf='i===2'>{{sub.value}}</td>
            </ng-container>

        </tr>
        <tr>
            <ng-container *ngFor='let sub of twodatalist;let i=index'>
            <th style="width: 130px">{{sub.name}}</th>
            <td class='readonlystyle'>{{sub.value}}%</td>
            </ng-container>
        </tr>

        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'rate', formModule: 'avenger-show' })
export class AvengerRateComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    items: any[] = [];

    twodatalist: any[] = [];

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.items = JSON.parse(data);
            this.twodatalist = this.items.splice(0, 3);
        }
    }
}
