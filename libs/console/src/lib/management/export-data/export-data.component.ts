import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

declare var $: any;

@Component({
    templateUrl: './export-data.component.html',
    styles: [
        `.xn-control-label { text-align:left }
        .flex { display: flex; }
        .title { width: 100px; }
        .label { font-weight: normal; flex: 1 }
        .down { margin: 15px; }`
    ]
})
export class ExportDataComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    rows: any[] = [];
    mainForm: FormGroup;
    pageTitle = '数据导出';
    tableTitle = '数据导出为Excel';
    shows = [];
    fields = [];
    choosed = [];
    tableName: '';

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

        this.shows = [
            {
                title: '选择数据表', checkerId: 'chooseTable', type: 'select', required: false, options: { ref: 'exportTable' }
            }
        ];

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe((v) => {
            this.tableName = v.chooseTable;
            this.getFields(this.tableName);
        });
    }

    getFields(name) {
        this.xn.api.post('/export_data/table_field', {
            tableName: name
        }).subscribe(json => {
            this.fields = json.data.data;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    down() {
        // 只需传给后台两个字段
        const choosed = this.choosed.map(v => {
            return {
                fName: v.fieldName,
                // tName: v.tName,
                field: v.field
            };
        });

        // 将choosed进行格式化
        const choose = [];
        for (const item of choosed) {
            choose.push({ field: item.field, fname: item.fName });
        }

        // 拼接文件名
        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = appId + '-' + orgName + '-' + time + '.xlsx';
        this.xn.api.download('/export_data/down_excel', {
            tableName: this.tableName,
            choosed: choose
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, filename);
        });
    }

    onChoose(choosed) {
        this.choosed = choosed;
    }
}
