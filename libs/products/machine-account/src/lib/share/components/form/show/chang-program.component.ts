import { Component, Inject, InjectionToken, Input, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from '../../../../../../../../../apps/xn-lr-web/src/app/pages/portal/shared/utils';


@Component({
    template: `
   <div>
   <ul class='ul-style'>
   <li *ngFor='let item of items'>
   <input type="checkbox" name="single" disabled [checked]="item['checked']"
   (change)="singleChecked(item)" /><span>{{item.label}}</span>
   </li>
   </ul>
   </div>
    `,
    styles: [
        `.ul-style {
            list-style: none;
            padding-left: 0;
        }
        `
    ]
})
@DynamicForm({ type: 'change-program', formModule: 'dragon-show' })
export class MachinechangeInfoShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    public items = [{
        label: '应收账款金额', value: 'isReceive', checked: false
    },
    {
        label: '转让价款', value: 'isChangePrice', checked: false
    },
    {
        label: '项目名称', value: 'isProjectName', checked: false
    }
    ];

    config: IChangeProgram[];


    constructor(
      @Optional() @Inject(ShowChangeProgramConfig) config: IChangeProgram[]
    ) {
        this.config = config;
        console.log('change program config show', config);
    }


    ngOnInit() {
        // 雅居乐-星顺/恒泽 只能修改 应收账款金额
        if (this.svrConfig && this.svrConfig.record.firstMainFlowId.endsWith('yjl') || this.svrConfig.record.firstMainFlowId.endsWith('hz')) {
            this.items = this.items.splice(0, 1);
        }

        // 外面注入值，优先使用
        if (this.config) {
          this.items = XnUtils.deepClone(this.config);
        }

        const data = JSON.parse(this.row.data);
        this.items.forEach((item) => {
            const it = data.find((c) => c.value === item.value);
            if (it && item.value === it.value) {
                item.checked = it.checked;
            }
        });

    }

    /**
         * 单选
         * @param paramItem
         * @param index
         */
    public singleChecked(paramItem) {
        if (paramItem['checked'] && paramItem['checked'] === true) {
            paramItem['checked'] = false;
        } else {
            paramItem['checked'] = true;
        }
    }



}

/** 修改项目数据 */
export interface IChangeProgram {
    label: string;
    value: string;
    checked: boolean;
}

export const ShowChangeProgramConfig = new InjectionToken<IChangeProgram[]>('showChangeProgram.config');
