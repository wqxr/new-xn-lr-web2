import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import VankeFactorTabConfig from '../../common/table.config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { Observable, of, fromEvent } from 'rxjs';
import { XnUtils } from '../../../xn-utils';
import * as _ from 'lodash';


@Component({
    selector: 'table-input-change',
    templateUrl: './table-input-change.component.html',
    styles: [`
    .table-head table,.table-body table{width:100%;border-collapse:collapse;margin-bottom: 0px;}
    .table-head{background-color:white}
    .table-body{width:100%; max-height:600px;overflow-y:auto;min-height:50px;}
    .table-body table tr:nth-child(2n+1){background-color:#f2f2f2;}
    .headstyle  tr th{
        border:1px solid #cccccc30;
        text-align: center;
    }
    table thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
        word-wrap: break-word;
        word-break: break-all;
        }
    .table-body table tr td{
        border:1px solid #cccccc30;
        text-align: center;
        max-width: 70px;
        word-wrap:break-word
    }
    .table-head table tr th {
        border:1px solid #cccccc30;
        text-align: center;
    }
    `]
})
@DynamicForm({
    type: 'table-input-change',
    formModule: 'default-input'
})
export class TableInputChangeComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    memo: any;
    tabConfig: any;
    items: any[] = [];
    heads: any[] = [];
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;


    constructor(public hwModeService: HwModeService,
        private er: ElementRef,) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.tabConfig = VankeFactorTabConfig.flowtableInfo.filter(x => x.flowId.includes(this.row.flowId) && x.checkerId === this.row.checkerId);
        this.heads = this.row.heads;
        if (!!this.row.value) {
            this.items = JSON.parse(this.row.value);
        } else {
            this.items = [];
        }
        if (!!this.form.get('correctReason')) {
            this.form.get('correctReason').valueChanges.subscribe(x => {
                if (!!x && !!x.first) {
                    const indexNum = _.findIndex(this.items, ['name', x.first]);
                    if (indexNum === -1) {
                        this.items.unshift({ opinion: x.first + x.second.join('、'), name: x.first });
                    } else {
                        this.items[indexNum].opinion = x.first + x.second.join('、');
                    }
                    this.ctrl.setValue(this.items);
                }
            })
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
    public calcAttrColspan(): number {
        return this.heads.length;
    }
    //修改
    getOpinion(item, index) {
        this.items[index].opinion = item.opinion;
        this.ctrl.setValue(this.items);
    }
    getOpinion1(itemdata, item, index, paramIndex) {
        item[index].opinion = itemdata.opinion;
        this.items[paramIndex].opinion = item;
        this.ctrl.setValue(JSON.stringify(this.items));
    }

}
