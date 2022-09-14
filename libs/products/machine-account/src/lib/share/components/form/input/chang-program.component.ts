import { Component, Inject, InjectionToken, Input, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { IChangeProgram } from '../show/chang-program.component';
@Component({
    template: `
   <div>
   <ul class='ul-style'>
   <li *ngFor='let item of items'>
   <input type="checkbox" name="single" [checked]="item['checked']"
   (change)="singleChecked(item,i)" /><span>{{item.label}}</span>
   </li>
   </ul>
   </div>
    `,
    styles: [
        `.ul-style {
            list-style: none;
            padding-left: 0px;
        }
        `
    ]
})
@DynamicForm({ type: 'change-program', formModule: 'dragon-input' })
export class MachinechangeInfoComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    ctrl: AbstractControl;


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
        @Optional() @Inject(InputChangeProgramConfig) config: IChangeProgram[],
        private xn: XnService,
        private vcr: ViewContainerRef) {
        this.config = config;
        console.log('change program config input', config);
    }


    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        if (!!this.row.value) {
            // 雅居乐-星顺/恒泽 只能修改 应收账款金额(初审)
            if (this.svrConfig &&
                this.svrConfig.mainFlowId
            ) {
                if (this.svrConfig.mainFlowId.endsWith('yjl') ||
                    this.svrConfig.mainFlowId.endsWith('hz')) {
                    this.items = this.items.splice(0, 1)
                }

            }
            // 雅居乐-星顺/恒泽 只能修改 应收账款金额(复核退回)
            if (this.svrConfig &&
                this.svrConfig.record) {
                if (this.svrConfig.record.mainFlowId.endsWith('yjl') ||
                    this.svrConfig.record.mainFlowId.endsWith('hz')) {
                    this.items = this.items.splice(0, 1)
                }
            }
            let data = JSON.parse(this.row.value);
            data.map((val) => {
                val['label'] = this.items.find(item => item['value'] === val['value']).label;
            });
            this.items = data;
        }
        // 雅居乐-星顺/恒泽 只能修改 应收账款金额(初审)
        if (this.svrConfig &&
            this.svrConfig.mainFlowId
        ) {
            if (this.svrConfig.mainFlowId.endsWith('yjl') ||
                this.svrConfig.mainFlowId.endsWith('hz')) {
                this.items = this.items.splice(0, 1)
            }

        }
        // 雅居乐-星顺/恒泽 只能修改 应收账款金额(复核退回)
        if (this.svrConfig &&
            this.svrConfig.record) {
            if (this.svrConfig.record.mainFlowId.endsWith('yjl') ||
                this.svrConfig.record.mainFlowId.endsWith('hz')) {
                this.items = this.items.splice(0, 1)
            }
        }

        // 外面注入值，优先使用
        if (this.config) {
            this.items = this.config;
        }
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
        this.toValue();
    }
    toValue() {
        let currentItem = this.items.filter((x: any) => x.checked === true);
        if (currentItem.length === 0) {
            this.ctrl.setValue('');
        } else {
            let value = [];
            this.deepCopy(this.items, value);
            value.forEach(x => {
                delete x.label;
            });
            this.ctrl.setValue(JSON.stringify(value));
        }



    }
    deepCopy(obj, c?: any) {
        c = c || {};
        for (let i in obj) {
            if (typeof obj[i] === 'object') {
                c[i] = obj[i].constructor === Array ? [] : {};
                this.deepCopy(obj[i], c[i]);
            } else {
                c[i] = obj[i];
            }
        }
        return c;
    }



}

export const InputChangeProgramConfig = new InjectionToken<IChangeProgram[]>('inputChangeProgram.config');
