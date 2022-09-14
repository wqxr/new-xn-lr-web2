

import { Component, Input, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../../modal/invoice-data-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

@Component({
    templateUrl: './pre-paytable.component.html',
    styleUrls: [`../show/show-input.component.css`]

})
@DynamicForm({ type: 'dragon_book_info', formModule: 'dragon-input' })
export class DragonPrepaytable implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    heads = TableHeadConfig.getConfig('龙光提单')['深圳市龙光控股有限公司'];
    label = '未填写';
    // 左移动距离
    public headLeft = 0;
    constructor(private cdr: ChangeDetectorRef, public hwModeService:HwModeService,
        private xn: XnService,
        private vcr: ViewContainerRef,) {
    }

    public items: any;
    ngOnInit() {
        const data = this.row.value;

        if (!!data) {
            this.items = JSON.parse(data);
            if (this.items.headquarters === HeadquartersTypeEnum[1]) {
                this.heads = TableHeadConfig.getConfig('龙光提单')['万科企业股份有限公司'];
                this.cdr.markForCheck();
            }

        }
    }
    public onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
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
}
