import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import CapitalcapitalProductInfoConfig from './capital-product-info';
declare var $: any;

@Component({
    selector: 'xn-gemdale-capital-product-info',
    templateUrl: './capital-product-info.component.html',
    styleUrls: ['./capital-product-info.component.css']
})
export class XnGemdaleCapitalProductInfoComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() params: any;
    public mainForm: FormGroup;  //表单类
    public rows: any[] = [];  //表单数据
    public formModule: string = 'dragon-input';

    public tableListData: any[] = [];//表格数据

    public tableConfigAll?: any[];  //表格配置项
    public svrConfig?: any;  //控件配置项
    public queryParams: any; // 路由数据
    public downloadList: any[] = []; // 中介机构下载文件权限数组

    subResize: any;  //滚动条监听
    // 页码配置
    pageConfig = {
        specialProjectFileList: {
            pageSize: 5,
            first: 0,
            total: 0,
            page: 1, //当前页码
        }
    };

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private er: ElementRef,
        public hwModeService: HwModeService,) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe(params => {
            if (XnUtils.isEmptyObject(params)) {
                return;
            }
            this.queryParams = { ...params };
        });
        this.doShow();
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
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($("body"));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        //滚动条的宽度
        let scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.table-head', this.er.nativeElement).attr("style", `width: calc(100% - ${scrollBarWidth1}px`);
    }

    /**
     * 处理数据
     */
    private doShow() {
        // console.log("queryParams==", this.queryParams);
        //基础资产池概况
        this.buildRows();
        //表格信息
        this.buildTable();
    }

    /**
     *  根据配置渲染form
     */
    private buildRows(): void {
        let param = {
            capitalPoolId: this.queryParams.capitalPoolId
        };
        this.xn.loading.open();
        this.xn.dragon.post('/project_manage/pool/pool_invest_tier_list', param).subscribe(res => {
            let params = {};
            if (res.ret === 0 && res.data) {
                params = res.data;
                res.data.rows.forEach((x: any) => {  // 产品期限=产品到期日-产品设立日期
                    if (res.data.productCreateTime && x.productendTime) {
                        x.productTerm = (x.productendTime - res.data.productCreateTime) / (24 * 60 * 60 * 1000) + '天'
                    } else {
                        x.productTerm = ''
                    }
                })
                params['levelInfoList'] = res.data.rows || [];
            }
            //基础资产池概况
            let config = CapitalcapitalProductInfoConfig.setRowsValue(params);
            config['params'] = this.queryParams;
            this.svrConfig = XnFlowUtils.handleSvrConfig(config);
            this.rows = this.svrConfig.checkers;
            this.mainForm = XnFormUtils.buildFormGroup(this.rows);

            //层级信息
            this.tableConfigAll = CapitalcapitalProductInfoConfig.setTableValue(params);
        });
    }

    /**
     *  根据配置渲染table
     */
    private buildTable(): void {
        this.tableConfigAll = CapitalcapitalProductInfoConfig.tableListAll;
        Object.keys(this.pageConfig).forEach((key) => {
            this.pageConfig[key] = { pageSize: 5, first: 0, total: 0, page: 1 };
        });
        this.onPage('specialProjectFileList', this.pageConfig.specialProjectFileList);
    }

    /**
     * 页码改变触发
     * @param checkerId
     * @param e
     */
    onPage(checkerId: string, e?: { page: number, first?: number, pageSize?: number, total?: number }) {
        console.log("onPage", e);
        if (e) {
            this.pageConfig[checkerId] = Object.assign({}, this.pageConfig[checkerId], e);
        }
        let param = {};
        let start = 0;
        let length = 0;
        if (['specialProjectFileList'].includes(checkerId)) {
            start = (this.pageConfig[checkerId].page - 1) * this.pageConfig[checkerId].pageSize;
            length = this.pageConfig[checkerId].pageSize;
            param = {
                capitalPoolId: this.queryParams.capitalPoolId
            };
        }
        let post = CapitalcapitalProductInfoConfig.tableListAll.find(tableObj => tableObj.checkerId === checkerId);
        this.xn[post.urlType].post(post.url, param).subscribe((res) => {
            let paramVal = {};
            if (res.ret === 0 && res.data) {
                if (['specialProjectFileList'].includes(checkerId)) {
                    this.pageConfig[checkerId].total = res.data.count || 0;
                }
                if (post.url === '/project_manage/file_agency/get_agency_file_list') {
                    this.downloadList = res.data.downloadList // 中介机构下载文件权限数组
                }
                paramVal[checkerId] = !!res.data.data && res.data.data.length ? res.data.data.slice(start, start + length) : [];
            }
            this.tableConfigAll = CapitalcapitalProductInfoConfig.setTableValue(paramVal);
        })
    }

    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(item: any) {
        let files = JSON.parse(item.files);
        files.forEach(x => {
            x['isAvenger'] = false;
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, files).subscribe();
    }

    /**
     * 下载所有附件
     * @param event 
     */
    public onDownloadAll(event: any) {
        let param = {
            capitalPoolId: this.queryParams.capitalPoolId
        };
        this.xn.api.dragon.download('/project_manage/file_agency/download_agency_file', param).subscribe((v: any) => {
            this.xn.loading.close();
            this.xn.api.dragon.save(v._body, '专项计划相关文件.zip');
        });
    }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn 按钮操作配置
     * @param index 下标
     */
    public handleRowClick(item: any, btn: any, index: number) {
        if (btn.operate === 'project_file_download') {
            let param = {
                capitalPoolId: this.queryParams.capitalPoolId,
                fileType: item.fileType
            };
            let files = JSON.parse(item.files)[0];

            this.xn.file.saveFile(files, files.fileName, 'dragon');
        }
    }

    /**
     * 返回到基础资产列表
     * @param event 
     */
    public onGoBack(event: any) {
        this.onCancel();
    }

     /**
     * 是否有下载文件权限
     * @param item 
     */
    public judgeDownLoad(item: any):string {
        return this.downloadList.includes(item.fileType)?'':'disabled'
    }

    /**
     *  取消并返回
     */
    public onCancel() {
        this.xn.router.navigate(['/xn-gemdale/assets-management/capital-pool'], {
            queryParams: {
                ...this.queryParams
            }
        });
    }

    /**
    * 计算表格合并项
    * currentSubTab.headText.length + 序号1 + 行操作+1
    */
    public calcAttrColspan(tableListConfig: any): number {
        let nums: number = tableListConfig.tableConfig.heads.length + 1;
        const boolArray = [tableListConfig.rowBtn && tableListConfig.rowBtn.length > 0];
        nums += boolArray.filter(arr => arr === true).length;
        return nums;
    }

}

//项目管理-上传文件、产品信息专项计划相关文件
export enum FileType {
    '计划管理人文件' = 1,
    '原始权益人文件' = 2,
    '律所文件' = 3,
    '资产服务机构文件' = 4,
    '评级机构文件' = 5,
    '托管服务机构文件' = 6,
    '承销机构文件' = 7,
    '会计师事务所文件' = 8,
    '资金服务机构文件' = 9,
}