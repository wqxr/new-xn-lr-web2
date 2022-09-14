import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-hover file-row-table" width="100%">
            <thead>
            <tr>
                <th>初审复核人</th>
                <th>审核意见</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{msgFirstReviewtype.reviewFirst}}</td>
                <td>{{msgFirstReviewtype.reviewFirstMemo}}</td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'msgFirstReview', formModule: 'avenger-show' })
export class AvengerMsgFirstReviewComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() memo: string;
    public msgFirstReviewtype = {
        reviewFirst: '',
        reviewFirstMemo: '',
    };
    public items: any[] = [];

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (data !== '') {
            this.msgFirstReviewtype = JSON.parse(data);
        }
    }
}
