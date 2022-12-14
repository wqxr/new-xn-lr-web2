import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    template: `
    <div style='width:100%'>
        <table class="table table-bordered table-striped table-max">
            <!--现金流量表-->
            <tbody>

            <tr>
                <td class='tdfirst'> 第一步：线下签署合同</td>
                <td>点击下方【担保合同模板】，下载打印后签字（如为法人担保还需加盖公章），并将签字视频发送客户经理，将纸质合同邮寄至{{row.data}}</td>
            </tr>
            <tr>
                <td class='tdfirst'>
                第二步：线上签署合同
                </td>
                <td>点击【提交】后，在【弹窗】内对每份合同进行【签署】，最后点击【完成】即可。

                等待保理商及平台完成签署，即可发起业务。
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    `,
    styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'guide', formModule: 'avenger-show' })
export class AvengerGuideComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    constructor() {
    }

    ngOnInit() {
        const items = this.row.data;



    }
}
