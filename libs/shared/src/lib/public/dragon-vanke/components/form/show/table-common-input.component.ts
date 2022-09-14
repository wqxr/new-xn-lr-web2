import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import DragonInfos, { HeadsStyle, TableStyle } from '../../bean/checkers.tab';

import { Observable, of, fromEvent } from 'rxjs';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';

@Component({
    templateUrl: '../input/table-common-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
   // selector: 'vanke-tableshow-common',
    styles: [`
  .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
      /*position: relative;*/
      cursor: pointer
  }
  .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
      font-family: 'Glyphicons Halflings';
      opacity: 0.5;
  }
  .table-head .sorting:after {
      content: "\\e150";
      opacity: 0.2
  }
  .table-head .sorting_asc:after {
      content: "\\e155"
  }
  .table-head .sorting_desc:after {
      content: "\\e156"
  }
  .height {
      overflow-x: hidden;
  }
  .relative {
      position: relative
  }
  .head-height {
      position: relative;
      overflow: hidden;
  }
  .table-height {
      max-height: 300px;
      overflow-y: scroll;
      overflow-x: auto;
      min-height:50px;
  }
  .table {
            table-layout: fixed;
            width: 3000px;
            border-collapse: separate;
            border-spacing: 0;
        }
  .table-display {
      margin: 0;
  }
  `]
})
// 查看二维码checker项
@DynamicForm({ type: 'table-common', formModule: 'dragon-show' })
export class VankeTableInfoInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    datavalue: any[] = [];
    heads: HeadsStyle[] = [];
    TabConfig: TableStyle;
    selectedItems: HeadsStyle[] = []; // 选中的项
    // rowBttons: HeadsStyle[] = [];
    headLeft = 0;
    subResize: any;


    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.TabConfig = DragonInfos[this.row.checkerId];
        this.heads = this.TabConfig.heads;
       // this.rowBttons = this.TabConfig.rowButtons;
        if (this.row.value === '') {

        } else {
            this.datavalue = JSON.parse(this.row.data);

        }
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
  *  查看合同
  * @param paramContract
  */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
    }
    handleRowClick(parambutton) {

    }
    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }
    ngAfterViewInit() {
        this.formResize();
    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    formResize() {
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
    }
    /**
    *  判读列表项是否全部选中
    */
    public isAllChecked(): boolean {
        return !(this.datavalue.some(x => !x.checked || x.checked && x.checked === false) || this.datavalue.length === 0);
    }

    /**
    *  全选
    */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.datavalue.forEach(item => item.checked = true);
            this.datavalue = XnUtils.distinctArray2([...this.selectedItems, ...this.datavalue], 'mainFlowId');
        } else {
            this.datavalue.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }
}
