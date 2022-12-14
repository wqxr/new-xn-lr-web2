import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import NewGemdaleInfos, { HeadsStyle, TableStyle } from './checkers.tab';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent } from 'rxjs';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
declare const $: any;

@Component({
    templateUrl: './table-common-input.component.html',
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

@DynamicForm({ type: 'table-common-jd', formModule: 'dragon-input' })
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
    selectedItems: HeadsStyle[] = []; // ????????????
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
            this.datavalue = JSON.parse(this.row.value);
        }
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
  *  ????????????
  * @param paramContract
  */
    public showContract(paramContract: any) {
        const params = Object.assign({}, paramContract, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
    }
    handleRowClick(parambutton) {

    }
    // ????????????
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }
    ngAfterViewInit() {
        this.formResize();
    }
    ngOnDestroy() {
        // ???????????????????????????????????????????????????????????????????????????????????????
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
        // ??????????????????
        const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px)`);
    }
}
