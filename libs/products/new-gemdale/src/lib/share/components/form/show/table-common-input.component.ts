import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import NewGemdaleInfos, { HeadsStyle, TableStyle } from '../input/checkers.tab';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent } from 'rxjs';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
declare const $: any

@Component({
    templateUrl: '../input/table-common-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
  .table-display {
    margin: 0;
}
.height {
  overflow-x: hidden;
  clear:both;
}
.relative {
    position: relative
}
.head-height {
    position: relative;
    overflow: hidden;
}
.table-height {
    max-height: 600px;
    overflow: scroll;
}
.table {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
}
  `]
})
// 查看二维码checker项
@DynamicForm({ type: 'table-common-jd', formModule: 'dragon-show' })
export class NewGemdaleTableInfoInputComponent implements OnInit {

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
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.TabConfig = NewGemdaleInfos[this.row.checkerId];
        this.heads = this.TabConfig.heads;
        if (this.row.value === '') {

        } else {
            this.datavalue = JSON.parse(this.row.data);

        }
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
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
}
