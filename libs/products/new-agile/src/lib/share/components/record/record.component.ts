import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import { DataTableUtils } from 'libs/shared/src/lib/common/data-table-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Tables } from 'libs/shared/src/lib/config/tables';
import { DataTable } from 'libs/shared/src/lib/common/data-table';


class MyDataTable extends DataTable {
    protected buildDom(): string {
        return '<\'row\'<\'col-sm-12\'tr>>' +
            '<\'row xn-dt-footer\'<\'col-sm-5\'i><\'col-sm-7\'p>>';
    }

    protected buildTableColumns(): any[] {
        const columns = DataTableUtils.buildTableColumns(this.config);
        const html = `<a href="javascript:void(0)" class="editor_view">查看处理</a>`;
        return columns.concat({
            title: '操作',
            data: null,
            defaultContent: html,
            orderable: false,
            searchable: false,
            width: '100px'
        });
    }
}

@Component({
    selector: 'xn-new-agile-record',
    templateUrl: './record.component.html'
})
export class RecordComponent implements OnInit {

    datatable: MyDataTable;
    private flowId: string;

    pageTitle = '流程记录';
    pageDesc = '';
    tableTitle = '记录列表';
    newBtnText = '';
    showNew = false;

    constructor(private xn: XnService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.flowId = params.id;

            [this.pageTitle, this.pageDesc, this.tableTitle, this.newBtnText] = Tables.getFlowDesc(this.flowId);

            // 经办并且newBtnText不为空, 才显示发起流程按钮
            this.showNew = (this.xn.user.roles.indexOf('operator') > -1) && (this.newBtnText.length > 0);
            if (this.datatable) {
                this.datatable.destroy();
            }

            // 获取流程信息
            this.datatable = new MyDataTable(this.xn, '#mainTable', 'flow-record', {
                ordering: false,
                where: {
                    flowId: this.flowId
                }
            });
            $('#mainTable').off();
            $('#mainTable').on('click', 'a.editor_view', e => this.editAction({tag: e, value: 'edit_view'}));
        });
    }

    editAction(val: any) {
        val.tag.preventDefault();
        const data = this.datatable.datatable.row($(val.tag.target).closest('tr')).data();
        // status：0, 1编辑，2 查看
        if ((data.status !== 1 && data.status !== 0) || this.xn.user.roles.indexOf(data.nowRoleId) < 0) {
            this.xn.router.navigate([`/console/record/${this.flowId}/view/${data.recordId}`]);
        } else {
            this.xn.router.navigate([`/console/record/${this.flowId}/edit/${data.recordId}`]);
        }
    }

    onNewRecord() {
        this.xn.router.navigate([`/console/record/new/${this.flowId}`]);
    }
}
