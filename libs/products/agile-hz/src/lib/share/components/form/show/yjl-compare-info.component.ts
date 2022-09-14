import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <p>原收款信息</p>
        <table class="table-hover table table-bordered file-row-table" style="border:0;cellspacing:0;cellpadding:0">
            <tr>
                <th style="width: 20%">收款单位户名
                <td>{{items.old.receiveOrg}}</td>
            </tr>
            <tr>
                <th>收款单位账号</th>
                <td>{{items.old.receiveAccount}}</td>
            </tr>
            <tr>
                <th>收款单位开户行</th>
                <td>{{items.old.receiveBank}}</td>
            </tr>
            <tr>
                <th>变更原因</th>
                <td>{{items.changeReason | xnSelectTransform:'changeReasonYjl'}}</td>
            </tr>
            </table>
            <p style="margin-top:10px">新收款信息</p>
            <table class="table-hover table table-bordered file-row-table" style="border:0;cellspacing:0;cellpadding:0">
            <tr>
                <th style="width: 20%">收款单位户名
                <td>{{items.new.receiveOrg}}</td>
            </tr>
            <tr>
                <th>收款单位账号</th>
                <td>{{items.new.receiveAccount}}</td>
            </tr>
            <tr>
                <th>收款单位开户行</th>
                <td>{{items.new.receiveBank}}</td>
            </tr>

        </table>
    </div>
    `,
})
@DynamicForm({ type: 'compare-info-yjl', formModule: 'dragon-show' })
export class YjlChangeAccountShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // TO DO: 确认 items 是数组还是对象？
    public items: any = {} as any;

    constructor() {
    }

    ngOnInit() {
        const data = this.row.data;
        if (!!data) {
            this.items = JSON.parse(data);
        }
    }
}
