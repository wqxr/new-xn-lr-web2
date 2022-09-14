import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewContainerRef } from '@angular/core';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { PdfSignModalComponent } from '../modal/pdf-sign-modal.component';
import { XnService } from '../../services/xn.service';
import { SelectOptions } from '../../config/select-options';

// 表格组件
@Component({
    selector: 'app-public-edit-table-component',
    templateUrl: './edit-table.component.html',
    styles: [`
        .a-click {
            margin-right: 5px;
        }

        .file-view {
            max-height: 100px;
            overflow-y: auto;
        }

        .table tbody tr td {
            vertical-align: middle;
        }

        .table > tbody > tr > td.text-position {
            text-align: left;
        }
    `]
})
export class EditTableComponent implements OnInit, OnChanges {
    @Input() heads: any[]; // 表头字段显示
    @Input() data: any[]; // 数据

    // config = {
    //        edit: true,  可编辑
    //        select: true, 可选择
    //       rows: [{label: '编辑', value: 'edit'}, {label: '删除', value: 'delete'}]  行按钮
    //   }

    @Input() config: any; // 特殊配置
    @Input() type: number; // 类型
    @Output() headBtn: EventEmitter<any> = new EventEmitter(false); // 表头按钮
    @Output() handleRow: EventEmitter<any> = new EventEmitter(false);   // 行按钮
    allCheckedStatus: boolean;
    headBtnStatus: boolean;
    colspanCols: number; // 表格合并
    enterprisers = SelectOptions.get('abs_headquarters'); // 总部企业对应
    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnChanges() {
        console.log('列表数据：', this.data);
        console.log('this.heads', this.heads);
    }

    ngOnInit() {
        const len = Object.keys(this.config).filter(x => this.config[x] === true);
        this.colspanCols = this.heads.length + len.length;
    }

    // 全选/取消
    checkedAll() {
        this.allCheckedStatus = !this.allCheckedStatus;

        if (this.allCheckedStatus) {
            this.data.forEach(item => item.checked = true);
            this.headBtnStatus = true;
        } else {
            this.data.forEach(item => item.checked = false);
            this.headBtnStatus = false;
        }
        this.headBtn.emit(this.headBtnStatus);
    }

    // 单选
    checkedSingle(item, index) {
        if (this.data[index].checked && this.data[index].checked === true) {
            this.data[index].checked = false;
        } else {
            this.data[index].checked = true;
        }
        // 当有选中时,可以点击查验按钮
        const check1 = this.data.some((x: any) => x.checked === true);
        if (check1) {
            this.headBtnStatus = true;
        } else {
            this.headBtnStatus = false;
        }
        // 当数组中不具有checked且为false。没有找到则表示全选中。
        const check = this.data.some((x: any) => x.checked === undefined || x.checked === false);
        if (!check) {
            this.allCheckedStatus = true;
        } else {
            this.allCheckedStatus = false;
        }
        this.headBtn.emit(this.headBtnStatus);
    }

    handleClick(label, item) {
        this.handleRow.emit({ label, item });
    }

    // 查看合同
    viewDetail(item) {
        console.log(item);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: item.id,
            secret: item.secret,
            label: item.label,
            readonly: true
        }).subscribe(() => {
        });

    }

}
