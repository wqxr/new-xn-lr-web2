import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';



@Component({
    templateUrl: './data-content.component.html',
    styleUrls: ['./data-content.component.css'],
})
@DynamicForm({ type: 'data-content', formModule: 'new-agile-show' })
export class XnDataContentShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    // 左移动距离
    public headLeft = 0;

    // 表格字段对应
    heads = TableHeadConfig.getConfig('万科提单').雅居乐集团控股有限公司.headText;

    items: any[];

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,
        public hwModeService: HwModeService) {}

    ngOnInit(): void {
        const { data } = this.row;
        if (!!data) {
            this.items = JSON.parse(data);
        }
    }

    /**
     *  查看更多信息
     * @param item 长字符串    122，3213，12313，
     */
    public viewMoreDetailInfo(item) {
        item = item.toString().split(',');
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }
}
