import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'xn-show-avenger-platreject-component',
    templateUrl: './avenger-plat-reject.component.html',
    // styleUrls: ['../show-avenger-input.component.css'],
    styles: [
        `li {
            list-style:none;

        }`
    ]
})
@DynamicForm({
    type: [
        'ModifiedContent',
        'returncompany'
    ], formModule: 'avenger-input'
})
export class AvengerPlatRejectComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    type = '';
    // 组件配置的type类型
    supplierlist: any[] = [];
    upstreamlist: any[] = [];
    companylist: any[] = [];

    constructor() {
        //
    }

    ngOnInit() {
        this.type = this.row.type;
        this.companylist = [
            { label: 'supplier', name: '万科供应商', checked: false, checkerData: [] },
            { label: 'upstream', name: '上游客户', checked: false, checkerData: [] }
        ];
        if (this.type === 'ModifiedContent') {

            this.row.value.map(item => {
                if (item.name === 'supplier') {
                    this.supplierlist = item;
                }

            });
            this.row.value.map(item => {
                if (item.name === 'upstream') {
                    this.upstreamlist = item;
                }
            });
        }
    }
    /**
      * 单选
      * @param e
      * @param item
      * @param index
      */
    public singelChecked(e, items, con) {
        if (items.checked && items.checked === true) {
            items.checked = false;
        } else {
            items.checked = true;
            this.companylist.map(item => {
                if (item.label === con) {
                    item.checkerData.push(items.name);
                    item.checkerData = Array.from(new Set(item.checkerData));
                } else {
                    item.checkerData = [];
                }
            });
        }




    }
    public chosecompany(e, items) {
        if (items.checked && items.checked === true) {
            items.checked = false;
        } else {
            items.checked = true;
        }
    }



}
