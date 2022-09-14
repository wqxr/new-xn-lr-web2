import { Tables } from '../config/tables';
import { DataTableUtils } from './data-table-utils';
import { isNullOrUndefined } from 'util';
import { XnService } from '../services/xn.service';

declare let $: any;

export class DataTablePicker {

    private config: any;
    private title: string;
    private table: any;
    private submitCallback: any;
    private cancelCallback: any;
    private params: any;
    private isCancel: boolean;

    constructor(protected xn: XnService) {
    }

    open(title: string,
         confName: string,
         submitCallback: any,
         cancelCallback?: any,
         params?: any
    ): void {
        this.config = Tables.getConfig(confName);
        this.title = title;
        this.submitCallback = submitCallback;
        this.cancelCallback = cancelCallback;
        this.params = params || {};
        if (confName === 'UpstreamCustomers') {
            this.getDataFromAvengerServer(DataTableUtils.buildUrl(this.config, 'GET'), this.params);
        } else {
            this.getDataFromServer(DataTableUtils.buildUrl(this.config, 'GET'), this.params);
        }
    }

    private openModal(json: any): void {
        this.xn.modal.open(this.title,
            $('<table id="dataTablePicker" class="table table-bordered table-striped table-hover xn-table" ></table>'),
            () => this.onClose());
        this.xn.modal.getModal().find('div.modal-footer').hide();

        const fields = this.config.fields;
        const pinyins = ['拼音', '声母'];
        const noVisiables = [];
        for (let i = 0; i < this.config.fields.length; ++i) {
            for (const pinyin of pinyins) {
                if (this.config.fields[i].label === pinyin) {
                    noVisiables.push({
                        visible: false,
                        targets: i
                    });
                }
            }
        }

        // 创建表格
        this.table = $('#dataTablePicker').DataTable({
            dom: '<\'row xn-dt-header\'<\'col-sm-6\'l><\'col-sm-6 text-right\'f>>' +
                '<\'row\'<\'col-sm-12 pre-scrollable\'tr>>' +
                '<\'row xn-dt-footer\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
            orderMulti: false,
            language: DataTableUtils.dataTableLanguage,
            columns: this.buildTableColumns(),
            data: json.data.data,
            columnDefs: noVisiables.length > 0 ? noVisiables : undefined
        });

        // 事件监听 - 选择按钮
        $('');
        $('#dataTablePicker').one('click', 'a.editor_view', e => this.onSelect(e));
        this.isCancel = true;
    }

    private onClose() {
        this.table.destroy();
        if (this.isCancel && !isNullOrUndefined(this.cancelCallback)) {
            this.cancelCallback();
        }
    }

    private onSelect(e) {
        e.preventDefault();
        this.isCancel = false;
        this.xn.modal.close();

        if (!isNullOrUndefined(this.submitCallback)) {
            let data = this.table.row($(e.target).closest('tr')).data();
            if (this.config.formatLabelValue) {
                data = this.config.formatLabelValue(data);
            }
            this.submitCallback(data);
        }
    }

    private buildTableColumns(): any[] {
        const columns = DataTableUtils.buildTableColumns(this.config);
        columns.push({
            title: '',
            data: null,
            defaultContent: '<a href="javascript:void(0)" class="editor_view">选择</a>',
            orderable: false,
            searchable: false,
            width: '100px'
        });
        return columns;
    }

    private getDataFromServer(url: string, params: any) {
        params = params || {};
        this.xn.api.post(url, params)
            .subscribe(json => {
                this.openModal(json);
            });
    }
    private getDataFromAvengerServer(url: string, params: any) {
        params = params || {};
        this.xn.avenger.post(url, params)
            .subscribe(json => {
                this.openModal(json);
            });
    }
}
