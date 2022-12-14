import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import VankebusinessdataTabConfig from 'libs/shared/src/lib/public/dragon-vanke/components/bean/vanke-business-related';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

@Component({
    selector: 'zs-gemdale-file-related',
    templateUrl: './zs-gemdale-related-file.component.html',
    styles: [
        `
            .table {
                font-size: 13px;
            }

            .table-head .sorting,
            .table-head .sorting_asc,
            .table-head .sorting_desc {
                position: relative;
                cursor: pointer;
            }

            .table-head .sorting:after,
            .table-head .sorting_asc:after,
            .table-head .sorting_desc:after {
                position: absolute;
                bottom: 8px;
                right: 8px;
                display: block;
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .table-head .sorting:after {
                content: '\\e150';
                opacity: 0.2;
            }

            .table-head .sorting_asc:after {
                content: '\\e155';
            }

            .table-head .sorting_desc:after {
                content: '\\e156';
            }

            .tab-heads {
                margin-bottom: 10px;
                display: flex;
            }
            tbody tr:hover {
                background-color: #e6f7ff;
                transition: all 0.1s linear;
            }
        `
    ]
})
export class ZsGemdaleRelatedFileComponent implements OnInit {


    /** ???????????? */
    data: any[] = [];
    heads: any[];
    @Input() mainFlowId: string;
    @Input() params: any;

    /** ???????????? */
    pageConfig = {
        pageSize: 10,
        first: 1,
        total: 0,
    };
    tabConfig: any;
    /** ?????????????????? */
    options = [];
    paging = 0; // ???????????????
    public supplierOperateAppId: any;

    constructor(private xn: XnService, private vcr: ViewContainerRef, private loading: LoadingService) {
    }

    ngOnInit() {
        this.tabConfig = VankebusinessdataTabConfig.vankebusinessRelated;
        this.onPage({ page: this.paging });

        // ????????????????????????????????????, ???????????????????????????
        if (this.xn.user.orgType === 1) {
            this.supplierAppIdSet();
        }
    }
    showFile(paramFile) {
        const paramFiles = JSON.parse(paramFile);

        if (paramFiles.label !== undefined) {
            return paramFiles.label;
        } else {
            return paramFiles.fileName;
        }

    }
    /**
 * ??????????????????????????????????????? appId ??????
 */
    private supplierAppIdSet() {
        this.xn.api.post('/custom/vanke_v5/app/get_app',
            { orgName: this.xn.user.orgName }).subscribe(x => {
                this.supplierOperateAppId = x.data;
            });
    }

    viewMFiles(paramFile) {
        const paramFiles = JSON.parse(paramFile);
        if (paramFiles.label !== undefined) {
            const params = Object.assign({}, paramFiles, { readonly: true });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFiles]).subscribe(x => {

            });
        }

    }

    /**
     * ???????????? ?????? ?????????
     * @param paramFile ??????
     */
    public donwLoadFiles(paramFile) {
        const orgName = this.xn.user.orgName;
        this.xn.api.dragon.download('/file/downFile', {
            files: new Array(JSON.parse(paramFile)),
        }).subscribe((v: any) => {
            this.xn.dragon.save(v._body, `${orgName}??????.zip`);
        });
    }
 /**
     *  ????????????
     *  ?????????????????????????????????????????????????????????
     *  ?????????????????????????????????????????????????????????ID??????????????????????????????
     */
    public download() {
        this.xn.dragon.post('/list/main/flow_relate_file',
            { mainFlowId: this.mainFlowId, start: 0, length: Number.MAX_SAFE_INTEGER }).subscribe(x => {
                if (x.data && x.data.data && x.data.data.length) {
                    let files = x.data.data.map((x) => JSON.parse(x[0]));
                    files = XnUtils.uniqueBoth(files);
                    const appId = this.xn.user.appId;
                    const orgName = this.xn.user.orgName;
                    const time = new Date().getTime();
                    const filename = appId + '-' + orgName + '-' + time + '.zip';
                    this.xn.dragon.download('/file/downFile', {
                        files,
                        mainFlowId: this.mainFlowId
                    }).subscribe((v: any) => {
                        this.loading.close();
                        this.xn.dragon.save(v._body, filename);
                    });
                } else {
                    this.xn.msgBox.open(false, '???????????????');
                }
            });
        }

    /**
      * @param e  page: ???????????? pageSize: ?????????????????????first: ??????????????????????????????pageCount : ????????????
      * @summary ?????????????????????abs  ??????api???????????????????????????avenger ?????????abs???api
      */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // ????????????

        this.heads = CommUtils.getListFields(this.tabConfig.heads);

        // ????????????

        this.xn.loading.open();
        // ???????????? ???avenger,  ??????abs ???api
        this.xn.dragon.post('/list/main/flow_relate_file',
            { mainFlowId: this.mainFlowId, start: (this.paging - 1) * this.pageConfig.pageSize, length: this.pageConfig.pageSize }).subscribe(x => {
                if (x.data && x.data.data && x.data.data.length) {
                    this.data = x.data.data;
                    if (x.data.recordsTotal === undefined) {
                        this.pageConfig.total = x.data.count;
                    } else {
                        this.pageConfig.total = x.data.recordsTotal;
                    }
                } else if (x.data && x.data.lists && x.data.lists.length) {
                    this.data = x.data.lists;
                    this.pageConfig.total = x.data.count;
                } else {
                    // ?????????
                    this.data = [];
                    this.pageConfig.total = 0;
                }
            }, () => {
                // ?????????
                this.data = [];
                this.pageConfig.total = 0;
            }, () => {
                this.xn.loading.close();
            });
    }
    /**
   *  ??????
   */
    public onCancel(): void {
        this.xn.user.navigateBack();
    }
}
