

import { Component, Input, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from 'libs/products/machine-account/src/lib/share/modal/invoice-data-view-modal.component';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';


@Component({
    templateUrl: './pre-paytable.component.html',
    styleUrls: [`./show-input.component.css`]

})
@DynamicForm({ type: 'dragon_book_info', formModule: 'default-show' })
export class DragonPrepayShowTable implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    heads = TableHeadConfig.getConfig('龙光提单').深圳市龙光控股有限公司;
    label = '未填写';
    // 左移动距离
    public headLeft = 0;
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private cdr: ChangeDetectorRef, public hwModeService: HwModeService) {
    }

    public items: any;
    ngOnInit() {


        const data = JSON.parse(this.row.data);
        if (!!data) {
            this.items = data;
            if (this.items.headquarters === HeadquartersTypeEnum[1]) {
                this.heads = TableHeadConfig.getConfig('龙光提单').万科企业股份有限公司;
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
