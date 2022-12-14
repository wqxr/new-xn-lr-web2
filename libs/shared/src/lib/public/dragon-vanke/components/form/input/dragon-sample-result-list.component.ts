import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { fromEvent } from 'rxjs';
import CapitalSampleConfig from '../../bean/capital-sample';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DragonTableSortService } from '../../../../../services/table-sort.service';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
declare const moment: any;

@Component({
    selector: 'dragon-sample-result-list',
    templateUrl: './dragon-sample-result-list.component.html',
    styles: [
        `
        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }
        .item-label label {
            min-width: 150px;
            padding-right: 8px;
            font-weight: normal;
            line-height: 34px;
            text-align:right;
        }
        .item-control {
            flex: 1;
        }
        .item-control select {
            width: 100%
        }
        .table-head table,.table-body table{
            margin-bottom: 0px
        }
        .table-body{
            width:100%;
            max-height:1000px;
            overflow-y:auto;
            min-height:50px;
        }
        .table-body table tr:nth-child(2n+1){
            background-color:#f9f9f9;
        }
        table thead,tbody tr {
            display:table;
            width:100%;
            table-layout:fixed;
        }
        .table-head table tr th {
            border:1px solid #cccccc30;
            text-align: center;
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
        }
        .ocrinfo {
            background-color: #cbecee;
            color:red;
        }

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
        `
    ]
})
@DynamicForm({ type: 'sample-result-list', formModule: 'dragon-input' })
export class DragonSampleResultListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl: AbstractControl;
    public sampleResultCensusCtrl: AbstractControl;

    public items: any[] = [];
    public Tabconfig: any;
    selectValue = '';
    currentTab: any; // ???????????????
    alert = '';
    public xnOptions: XnInputOptions;
    public myClass = '';

    params = {   // ??????????????????
        checker: [],
        title: '????????????',
    };
    myOptions = {
        'show-delay': 800,
        'hide-delay': 800,
        'max-width': '860px',
        placement: 'right',
    };

    subResize: any;
    private tooltip$ = new Subject<string>();

    private sorting = ''; // ??????????????? ?????????
    private naming = ''; // ??????????????? ???css??????
    constructor(private xn: XnService, private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef, private er: ElementRef,
        private tableSortService: DragonTableSortService,
        public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        const capitalPoolId = this.svrConfig.params.capitalPoolId || '' // ?????????id
        const selectSample = this.svrConfig.params.selectSample || '' // ???????????? selectSample -1:??????????????? 0:???????????? 1:????????????
        if (Number(selectSample) === 1) {
            // ????????????????????????
            this.xn.dragon.post('/sample/get_sample_list', { capitalPoolId }).subscribe(x => {
                if (x.ret === 0) {
                    this.items = x.data.data
                    this.ctrl.setValue(JSON.stringify(this.items));
                }
            });
        }

        this.currentTab = CapitalSampleConfig.sampleResult;
        this.items = this.row.value ? JSON.parse(this.row.value) : this.items;
        this.setCensusValue(this.items);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.ctrl.valueChanges.subscribe((x) => {
            this.items = x ? JSON.parse(x) : [];
            this.setCensusValue(this.items);
            this.cdr.markForCheck();
            setTimeout(() => { this.formResize(); }, 0);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.subResize = fromEvent(window, 'resize').subscribe(() => {
            this.formResize();
        });
        this.tooltip$.pipe(
            debounceTime(300),   // ???????????? 300??????
            distinctUntilChanged()  // ??????
        ).subscribe((param) => { this.viewDetailFunc(param); });
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
        const scrollBarWidth = $('.table-body', this.er.nativeElement).outerWidth(true) - $('.table-body>table').outerWidth(true);
        $('.table-head', this.er.nativeElement).css({ 'padding-right': scrollBarWidth ? scrollBarWidth + 'px' : '0px' });
    }

    /**
     * ????????????-??????????????????
     * @param items ??????????????????
     */
    setCensusValue(items: any[]) {
        const sumReceive = items.map((x: any) => x.receive).reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue ? currentValue : 0);
        }, 0);
        const capitalCountRatio = Number(this.svrConfig.params.totalCount) ? (items.length / Number(this.svrConfig.params.totalCount)) : 0;
        const capitalSumRatio = Number(this.svrConfig.params.sumReceive) ? (sumReceive / Number(this.svrConfig.params.sumReceive)) : 0;
        const params = {
            capitalCount: items.length || 0,
            capitalCountRatio: XnUtils.formatPercentage(capitalCountRatio.toFixed(4)),
            capitalSum: XnUtils.formatMoney(sumReceive),
            capitalSumRatio: XnUtils.formatPercentage(capitalSumRatio.toFixed(4)),
        };
        this.form.get('sampleResultCensus').get('capitalCount').setValue(params.capitalCount);
        this.form.get('sampleResultCensus').get('capitalCountRatio').setValue(params.capitalCountRatio);
        this.form.get('sampleResultCensus').get('capitalSum').setValue(params.capitalSum);
        this.form.get('sampleResultCensus').get('capitalSumRatio').setValue(params.capitalSumRatio);
    }

    /**
     * ?????????
     */
    handleRowClick(index: number) {
        this.xn.msgBox.open(true, `?????????????????????????????????????????????????????????????????????????`, () => {
            this.items.splice(index, 1);
            this.toValue();
        }, () => {
        });
    }

    /**
     *  ??????????????????
     * @param paramFile
     */
    public viewFiles(paramFile) {
        // paramFile = '[{"fileId":"U100006_10026_QAODJF_017510101_00","fileName":"????????????_20200507103417.jpg","filePath":"U100006_10026_20200521T174027_017510101_00.jpg"}]';
        const files = JSON.parse(paramFile);
        files.forEach(x => {
            x.isAvenger = false;
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, files).subscribe();
    }

    /**
     * ??????????????????
     * @param mainFlowId
     */
    viewDetail(mainFlowId: string) {
        this.tooltip$.next(mainFlowId);
    }

    /**
     * ??????????????????????????????
     * @param mainFlowId
     */
    viewDetailFunc(mainFlowId: string) {
        this.params.checker = CapitalSampleConfig.businessDetails.checkers;
        this.params.checker.forEach((x) => x.data = '');
        this.xn.dragon.post('/project_manage/file_contract/business_detail', { mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                this.params.checker.forEach((obj) => {
                    if (obj.value === 'type') {
                        obj.data = x.data[0].type === 1 ? 'ABS??????' : x.data[0].type === 2 ? '?????????' : '??????';
                    } else if (obj.value === 'freezeOne') {
                        obj.data = x.data[0].freezeOne === 0 ? '?????????' : '?????????';
                    } else if (obj.value === 'headPreDate' || obj.value === 'factoringEndDate' || obj.value === 'realLoanDate' || obj.value === 'priorityLoanDate') {
                        obj.data = x.data[0][obj.value] ? moment(x.data[0][obj.value]).format('YYYY-MM-DD') : '';
                    } else {
                        obj.data = x.data[0][obj.value] || '';
                    }
                });
            }
        });
    }

    /**
     * ??????????????????
     * @param mainFlowId
     */
    viewProgress(mainFlowId) {
        this.xn.router.navigate([`logan/main-list/detail/${mainFlowId}`]);
    }


    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    // ?????????????????????
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        }
        else {
            this.items.forEach(() => {
                this.ctrl.setValue(JSON.stringify(this.items));
            });
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  ???????????????
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }
    /**
     *  ??????????????????
     * @param sort
     */
    public onSort(sort: string) {
        const params = {} as any;
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        // ????????????
        if (this.sorting && this.naming) {
            params.order = this.sorting + ',' + this.naming;
        }
        this.tableSortService.tableSort(this.items, params.order);
        this.toValue();
    }
}
