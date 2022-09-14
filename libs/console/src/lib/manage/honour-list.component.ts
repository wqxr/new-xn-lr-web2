import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {DataTable} from 'libs/shared/src/lib/common/data-table';
import {DataTableUtils} from 'libs/shared/src/lib/common/data-table-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {HonourDetailModalComponent} from 'libs/shared/src/lib/public/modal/honour-detail-modal.component';

class MyDataTable extends DataTable {
    protected buildDom(): string {
        return '<\'row\'<\'col-sm-12\'tr>>' +
            '<\'row xn-dt-footer\'<\'col-sm-5\'i><\'col-sm-7\'p>>';
    }

    protected buildTableColumns(): any[] {
        const columns = DataTableUtils.buildTableColumns(this.config);
        const html = '<a href="javascript:void(0)" class="editor_view">查看详情</a>';
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
    templateUrl: './honour-list.component.html'
})
export class HonourListComponent implements OnInit {

    private datatable: MyDataTable;
    private flowId: string;

    pageTitle = '商票展示';
    pageDesc = '';
    tableTitle = '商票展示';
    newBtnText = '';
    showNew = false;
    searchVal = '';

    constructor(private xn: XnService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

        if (this.datatable) {
            this.datatable.destroy();
        }

        this.datatable = new MyDataTable(this.xn, '#mainTable', 'money-order', {
            ordering: true,
            filter: true,
            // draw: true,
            // start: 0,
            // length: 0,
            // options: true,
            where: {
                // billNumber: 1234
            }
        });


        $('#mainTable').off();
        $('#mainTable').on('click', 'a.editor_view', e => this.viewDetail(e));
        $('#mainTable').on('keyup', 'input.input-sm', e => this.search(e));
        this.searchVal = $('input.input-sm').val();

        $('input.input-sm').keyup(() => {
            this.searchVal = $('input.input-sm').val();
            this.datatable.search(this.searchVal);

            // if (this.datatable) {
            //     this.datatable.destroy();
            // }

            // this.datatable = new MyDataTable(this.xn, '#mainTable', 'money-order', {
            //     ordering: true,
            //     // draw: true,
            //     // start: 0,
            //     // length: 0,
            //     // options: true,
            //     where: {
            //         billNumber: this.searchVal ? this.searchVal : undefined
            //     }
            // });

            // $("input").css("background-color","#D6D6FF");
        });
    }

    viewDetail(e) {
        e.preventDefault();
        const data = this.datatable.datatable.row($(e.target).closest('tr')).data();
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourDetailModalComponent, data).subscribe(v => {
        });
    }

    search(e) {
    }

}
