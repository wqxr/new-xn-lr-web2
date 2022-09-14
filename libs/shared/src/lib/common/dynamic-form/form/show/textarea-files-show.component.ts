import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';

@Component({
    template: `
    <div>
        <div class="" rows="6" style="height: 100px;border: 1px solid #d2d6de;overflow: auto;" readonly>
            <span class="pull-left-container" *ngFor="let item of newRow;let i = index">
                <span class="label label-files">{{item}}</span>
            </span>
        </div>
        <p style='margin-top: 2px;font-size: 12px;color:#9d9b9b' *ngIf="showP">{{supplierCount}}</p>
    </div>
    `,
    styles: [
        `.label-files{
            color:#9d9b9b
        }
        `
    ]
})
@DynamicForm({ type: 'supplier-text', formModule: 'default-show' })
export class TextareaFilesShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    newRow: any;
    supplierCount = '';
    showP = true;

    constructor() {
    }

    ngOnInit() {
        this.newRow = this.row.data ? JSON.parse(this.row.data) : [];
        if (this.newRow && this.newRow.length){
            this.supplierCount = `共${this.newRow.length}个供应商`;
        }
    }
}
