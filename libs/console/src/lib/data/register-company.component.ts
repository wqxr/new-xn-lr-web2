import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {DataTable} from 'libs/shared/src/lib/common/data-table';
import {DataTableUtils} from 'libs/shared/src/lib/common/data-table-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

class MyDataTable extends DataTable {
    protected buildDom(): string {
        return '<\'row\'<\'col-sm-12\'tr>>' +
            '<\'row xn-dt-footer\'<\'col-sm-5\'i><\'col-sm-7\'p>>';
    }

    protected buildTableColumns(): any[] {
        let columns = DataTableUtils.buildTableColumns(this.config);
        let html = '<a href="javascript:void(0)" class="editor_view">查看详情</a>';
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
    templateUrl: './register-company.component.html'
})
export class RegisterCompanyComponent implements OnInit {

    private datatable: MyDataTable;
    private flowId: string;

    pageTitle = '注册公司';
    pageDesc = '';
    tableTitle = '注册公司';
    newBtnText = '';
    showNew = false;

    constructor(private xn: XnService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

        if (this.datatable) {
            this.datatable.destroy();
        }

        this.datatable = new MyDataTable(this.xn, '#mainTable', 'app', {
            ordering: true,
        });

        $('#mainTable').off();
        $('#mainTable').on('click', 'a.editor_view', e => this.viewDetail(e));
    };

    viewDetail(e) {
        e.preventDefault();
        let data = this.datatable.datatable.row($(e.target).closest('tr')).data();
        this.xn.router.navigate([`/console/data/register-company/${data.appId}`]);
    }

}
