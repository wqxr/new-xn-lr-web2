import {Component, ElementRef, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {ActivatedRoute} from '@angular/router';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {EnterpriseContractModalComponent} from './enterprise-contract-modal.component';
import {HwModeService} from 'libs/shared/src/lib/services/hw-mode.service';
import {PdfSignModalComponent} from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';

/**
 *  交易控制-合同控制-企业详情页
 */
@Component({
    selector: 'app-enterprise-contract',
    templateUrl: './enterprise-contract.component.html',
    styles: [`
        .content-p {
            padding: 10px;
        }

        .flex {
            display: flex;
        }

        .flex-g {
            flex-grow: 1;
        }

        .search-title {
            min-width: 8rem;
        }
    `]
})
export class EnterpriseContractComponent implements OnInit {
    public data: Array<any> = [];
    public total = 0;
    public pageSize = 10;
    public shows = [];
    public mainForm: FormGroup;
    public searches = [];
    dataCache: any[] = [];
    currentPage = 0;
    orgName = '';

    constructor(
        public xn: XnService,
        private route: ActivatedRoute,
        private vcr: ViewContainerRef,
        private hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(x => {
            this.orgName = x.org;
            this.buildForm();
            this.init(1);
        });
    }


    onPage(page: number) {
        this.currentPage = page || 1;

        this.getData(this.currentPage);
    }

    // 查询
    searchMsg(page?) {
        this.getData(page);
    }

    // 编辑该条合同
    edit(item) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EnterpriseContractModalComponent, item).subscribe(x => {
            if (x && x.action === 'ok') {
                const params = {
                    mainFlowId: item.mainFlowId,
                    id: item.id,
                    contractValidityType: x.value.contractValidityType || '',
                    contractValidity: x.value.contractValidity || '',
                };
                this.xn.api.post('/yb/risk1/contract_control/edit_detail', params).subscribe(() => {
                    this.init(this.currentPage);
                });
            }
        });
    }

    // 合同下载
    down(item) {
        this.hwModeService.downContract(item.id, item.secret, `${item.label}(${this.orgName})`);
    }

    // 查看交易记录
    viewFlow(item) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    // 查看合同
    showContract(item) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: item.id,
            secret: item.secret,
            label: item.label,
            readonly: true
        }).subscribe();
    }

    // 重置
    reset() {
        this.mainForm.setValue({label: '', isFirst: '', mainFlowId: '', contractValidityType: '', signContractTime: ''});
        this.getData();
    }

    init(page) {
        // 获取所有数据
        this.xn.api.post('/yb/risk1/contract_control/get_detail', {orgName: this.orgName}).subscribe(data => {
            if (data.data && data.data.length) {
                this.dataCache = data.data;
                this.total = data.data.length;
                this.getData(page); // 分页获取
            }
        });
    }

    private getData(page?) {
        this.currentPage = page || 1;
        let filterData = this.dataCache; // 复制临时到变凉
        if (this.searches.length) {
            // 搜索 dataCache中包含字段的数组
            this.searches.map(x => {
                if (x.key === 'isFirst') {
                    filterData = filterData.filter(filter => filter[x.key] === (x.value === '1' ? true : false));
                } else if (x.key === 'signContractTime') {
                    const dateValue = JSON.parse(x.value);
                    filterData = filterData.filter(filter =>
                        dateValue.beginTime <= new Date(filter[x.key]).getTime()
                        && new Date(filter[x.key]).getTime() <= dateValue.endTime);
                } else {
                    filterData = filterData.filter(filter => filter[x.key] === x.value);
                }
            });
        }
        // 分页获取
        this.data = filterData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.total = filterData.length;
    }

    private buildForm() {
        this.shows = [
            {
                title: '合同名称',
                checkerId: 'label',
                type: 'text',
                required: false
            },
            {
                title: '是否首次业务',
                checkerId: 'isFirst',
                type: 'select',
                options: {ref: 'bussStatus'},
                required: false
            }, {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false
            },
            {
                title: '合同有效期类型',
                checkerId: 'contractValidityType',
                type: 'select',
                options: {ref: 'contractDateStatus'},
                required: false
            }, {
                title: '合同签署时间',
                checkerId: 'signContractTime',
                type: 'quantum1',
                required: false
            }
        ];
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(() => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
