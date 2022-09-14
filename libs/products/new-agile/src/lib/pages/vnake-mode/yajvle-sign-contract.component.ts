import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from './bank-mangement.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { EditInfoModalComponent } from 'libs/shared/src/lib/public/component/edit-info-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

/**
 * 确认信息，应收账款，签署合同，付款清单
 */
@Component({
    selector: 'app-yajvle-sign-contract-component',
    templateUrl: `./yajvle-sign-contract.component.html`,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }
    `]
})
export class YajvleSignContractComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 搜索项
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项
    currentTab: any; // 当前标签页

    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    preChangeTime: any[] = [];

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.label);
        });
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }

    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    // 加载信息
    initData(val: string) {
        if (this.label !== val) {
            this.selectedItems = []; // 切换标签页是清空选中的项
        }
        this.label = val;
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    onPage(e?) {
        this.xn.loading.open();
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
        this.searches = this.currentTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        this.xn.api.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.lists && x.data.lists.length) {
                this.data = x.data.lists;
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    // 搜索
    searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    // 重置
    reset() {
        this.selectedItems = [];
        this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    // 是否全选
    isAllChecked(): boolean {
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    // 全选
    checkAll() {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
        } else {
            this.data.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    // 单选
    singelChecked(e, item, i) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
        }

    }

    // 查看合同
    showContract(con) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: con.id,
            secret: con.secret,
            label: con.label,
            readonly: true
        }).subscribe(() => {
        });
    }

    // 查看更多发票
    viewMore(item) {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    // 表头按钮组事件
    handleHeadClick(btn) {
        switch (btn.label) {
            case '确认应收账款金额':
                this.confirmReceivable(btn);
                break;
            case '签署付款确认书':
                this.signPagmentConfirm(btn);
                break;
            case '批量签署':
                this.batchSign(btn);
                break;
            case '选择资金渠道':
                this.moneyChannel(btn);
                break;
            case '进入付款管理':
                this.inPayment(btn);
                break;
            case '补充信息':
                this.supplementTransInfo();
                break;
            case '重新签署':
                this.reSignContracts(btn);
                break;
            case '发起补充协议':
                this.initiateSupplementalAgreement(btn);
                break;

        }
    }

    /**
     *  雅居乐补充协议 重新签署合同
     * @param btn
     */
    private reSignContracts(btn) {
        this.xn.loading.open();
        this.xn.api.post(btn.get_api, { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data.contracts;
                const postCons = JSON.parse(JSON.stringify(cons));
                cons.isProxy = 18;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    x.config.text = '受让方（全称）';
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.post_api, { lists: postCons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                }, () => {
                }, () => {
                    this.xn.loading.close();
                });
            }, () => {
            }, () => {
                this.xn.loading.close();
            });
    }

    /**
     *  雅居乐补充协议 发起补充协议
     * @param btn
     */
    private initiateSupplementalAgreement(btn) {
        this.xn.loading.open();
        this.xn.api.post(btn.get_api, { mainIdList: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data.data;
                cons.isProxy = 18;
                const postCons = JSON.parse(JSON.stringify(cons));
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    x.config.text = '受让方（全称）';
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.post_api, { list: postCons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                }, () => {
                }, () => {
                    this.xn.loading.close();
                });
            }, () => {
            }, () => {
                this.xn.loading.close();
            });
    }

    // 行按钮组事件
    handleRowClick(item, btn) {
        switch (btn.label) {
            case '签署':
                this.singleSign(item, btn);
                break;
            case '中止操作':
                this.stopStep(item);
                break;
        }
    }

    // 判断数组
    arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? JSON.parse(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    viewProcess(id) {
        this.xn.router.navigate([
            `new-agile/main-list/detail/${id}`
        ]);
    }

    // 单个签署合同
    private singleSign(item, btn) {
        this.xn.loading.open();
        this.xn.api.post(btn.value, { mainFlowIds: [item.mainFlowId] })
            .subscribe(con => {
                this.xn.loading.close()
                const cons = con.data;
                cons.isProxy = 18;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    if (x.label.includes('国内无追索权商业保理合同')) {
                        x.config.text = '乙方（保理商、受让人）数字签名';
                    } else if (x.label.includes('应收账款转让' + '' + '书')) {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label === '应收账款转让登记协议') {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label === '应收账款转让合同') {
                        x.config.text = '受让方（全称）';
                    } else if (x.label === '应收账款转让合同(债权人<-->保理商)（通用版）雅居乐') {
                        x.config.text = '保理商（盖章）';
                    } else if (x.label === '应收账款转让登记协议(债权人<-->保理商)（通用版）雅居乐') {
                        x.config.text = '乙方公章/合同专用章';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.value2, { mainFlowIds: [item.mainFlowId], contractList: cons }).subscribe(() => {
                            this.onPage({ page: this.paging });
                        });
                    }
                });
            });
    }

    // 批量签署合同
    private batchSign(btn) {
        this.xn.api.post(btn.value, { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data;
                cons.isProxy = 18;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    if (x.label.includes('国内无追索权商业保理合同')) {
                        x.config.text = '乙方（保理商、受让人）数字签名';
                    } else if (x.label.includes('应收账款转让' + '' + '书')) {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label === '应收账款转让登记协议') {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label === '应收账款转让合同') {
                        x.config.text = '受让方（全称）';
                    } else if (x.label === '应收账款转让合同(债权人<-->保理商)（通用版）雅居乐') {
                        x.config.text = '保理商（盖章）';
                    } else if (x.label === '应收账款转让登记协议(债权人<-->保理商)（通用版）雅居乐') {
                        x.config.text = '乙方公章/合同专用章';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.value2, { mainFlowIds: this.selectedItems.map(main => main.mainFlowId), contractList: cons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                });
            });
    }

    // 中止操作
    private stopStep(item) {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'pay_over14',
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    // 选择资金渠道
    private moneyChannel(btn) {
        const params = {
            title: '请选择资金渠道',
            checker: [
                {
                    title: '资金渠道',
                    checkerId: 'moneyChannel',
                    type: 'radio',
                    options: { ref: 'moneyChannel' },
                    required: 1,
                }
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            this.xn.api.post(btn.value, { mainFlowIds: this.selectedItems.map(main => main.mainFlowId), moneyChannel: v.moneyChannel })
                .subscribe(() => {
                    this.selectedItems = [];
                    // 修改资金渠道
                    this.onPage({ page: this.paging });
                });
        });
    }

    // 推送到付款管理
    private inPayment(btn) {
        if (this.selectedItems.length <= 0) {
            this.xn.msgBox.open(false, '请选择资金渠道');
            return;
        }

        this.xn.api.post(btn.value, {
            lists: this.selectedItems.map(x => {
                return {
                    mainFlowId: x.mainFlowId,
                    moneyChannel: x.moneyChannel
                };
            })
        }).subscribe(() => {
            this.selectedItems = [];
            this.onPage({ page: this.paging });
        });
    }

    // 签署付款确认书 - 进入合同签署页面
    private signPagmentConfirm(btn) {
        this.localStorageService.setCacheValue('get_contract_url', btn.value);
        this.localStorageService.setCacheValue('get_contract2_url', btn.value2); // 获取已经签署的合同信息api
        this.localStorageService.setCacheValue('selected', this.selectedItems);
        this.xn.router.navigate(['console/gemdale/gemdale-supports/confirmation']);
    }

    // 确认应收账款金额
    private confirmReceivable(btn) {
        // 检查选中的交易是否有在进行中的
        this.xn.api.post(btn.value, { mainFlowIds: this.selectedItems.map(main => main.mainFlowId) }).subscribe(next => {
            if (next && next.data && next.data.length) {
                const mains = next.data.map((x: any) => x.mainFlowId);
                const str = mains.join(' , ');
                const html = `
                    <h5 style="font-weight: bold">以下交易重复提交，请重新选择</h5>
                    <p style="word-break: break-word">
                     ${str}
                    </p>
                `;
                return this.xn.msgBox.open(false, [html]);
            }
            this.xn.router.navigate(['console/record/new'], {
                queryParams: {
                    id: 'project_confirmation',
                    relate: '',
                    relateValue: ''
                }
            });
            this.xn.localStorageService.setCacheValue('selected', this.selectedItems); // 暂存信息
        });
    }

    // 保理商 对标准保理补充信息
    private supplementTransInfo() {
        // const staySupplement = this.selectedItems.filter(x => !x.factoringEndDate
        //     || (!!x.factoringEndDate && x.factoringEndDate === '')); // 交易保理到期日为空的交易项
        // const hasDateMainFlows = this.selectedItems.filter(x => !!x.factoringEndDate && x.factoringEndDate !== '')
        //     .map(y => y.mainFlowId);
        // if (staySupplement.length) {
        //     if (staySupplement.length < this.selectedItems.length) {
        //         const sliceObj = hasDateMainFlows.length > 2 ? {length: 2, msg: '...'} : {length: hasDateMainFlows.length, msg: ''};
        //         this.xn.msgBox.open(false,
        //             `已自动过滤无需补充项 ${hasDateMainFlows.slice(0, sliceObj.length).join(',')}${sliceObj.msg}`);
        //     }
        //     this.localStorageService.setCacheValue('staySupplementSelected', this.selectedItems);
        //     this.xn.router.navigate(['console/standard_factoring/trans_lists/supplement_info']);
        // } else {
        //     this.xn.msgBox.open(false, `无需要补充项`);
        // }
        if (this.selectedItems.some(x => (!x.factoringEndDate || x.factoringEndDate === '')
            || (!x.assigneePrice || x.assigneePrice === ''))) {
            this.localStorageService.setCacheValue('staySupplementSelected', this.selectedItems);
            this.xn.router.navigate(['console/standard_factoring/trans_lists/supplement_info']);
        } else {
            this.xn.msgBox.open(false, `无需要补充项`, () => {
                // 取消选中状态
                this.data.forEach(item => item.checked = false);
                this.selectedItems = [];
            });
        }

    }

    // 构建搜索项
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    // 搜索项值格式化
    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
                // 保存每次的时间值。
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // 默认创建时间
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime) {
                        // return;
                    } else {
                        this.beginTime = beginTime;
                        this.endTime = endTime;
                        this.paging = 1;
                        this.onPage({ page: this.paging });
                    }
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }
}
