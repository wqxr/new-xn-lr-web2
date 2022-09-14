import { Component, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ModalComponent, ModalSize } from "libs/shared/src/lib/common/modal/components/modal";
import { XnFormUtils } from "libs/shared/src/lib/common/xn-form-utils";
import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";
import { XnService } from "libs/shared/src/lib/services/xn.service";
import { Observable } from "rxjs";

/**
 *  参数默认
 */
export class EditParamInputModel {
    /** 标题 */
    public title?: string;
    /** 输入项 */
    public checker: CheckersOutputModel[];
    /** 其他配置 */
    public options?: any;
    /** 按钮*/
    public buttons?: string[];
    /** 弹框大小配置 */
    public size?: any;
    public type?: 'upload' | 'view' | 'edit';
    public mainFlowId?: string;
    /** 其他参数 */
    public params?: any
    /** 表格数据 */
    public tableInfo?: any[]
    constructor() {
        this.options = { tips: '' };
        this.buttons = ['取消', '确定'];
        this.size = ModalSize.Large;
    }
}

const heads = [
    { label: '交易ID', value: 'mainFlowId' },
    { label: '交易状态', value: 'flowId', type: 'currentStep' },
    { label: '收款单位名称', value: 'debtUnit' },
    { label: '应收账款金额', value: 'receive', type: 'money' },
    { label: '转让价款', value: 'changePrice', type: 'money' },
    { label: '合同名称', value: 'contractName' },
    { label: '项目名称', value: 'projectName' },
    { label: '创建时间', value: 'createTime', type: 'date' },
]

// 履约证明文件类型
const selectOptions = [
    {
        label: '工程类-结算款', value: 1, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程（封面） + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '工程结算书', value: 2,
                tip: '加盖供应商公章，相关负责人签字'
            },
            {
                label: '其他文件', value: 3,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '工程类-进度款', value: 2, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程（封面） + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '成本台账', value: 2,
                tip: '成本台账封面页+成本台账明细页（明细页圈出本笔业务，明细页要有签字'
            },
            {
                label: '监理报告', value: 3,
                tip: '第三方监理机构盖章+施工进度和投资完成情况（黑白复印件则需加盖公章）'
            },
            {
                label: '其他文件', value: 4,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '监理类', value: 3, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程 + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '成本台账', value: 2,
                tip: '成本台账封面页+成本台账明细页（明细页圈出本笔业务，明细页要有签字）'
            },
            {
                label: '监理费用汇总的明细表/工程进度及请款计算表', value: 3,
                tip: '加盖供应商公章，相关负责人签字'
            },
            {
                label: '监理公司的请款函 ', value: 4,
                tip: '加盖供应商公章，相关负责人签字'
            },
            {
                label: '其他文件', value: 5,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '贸易类', value: 4, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程 + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '入库明细', value: 2,
                tip: '1. 入库总金额≥资金计划 2. 入库明细与资金计划，送货单，订货合同之间存在货物数量与金额的对应关系 3. 根据入库明细可确认最大金额订单'
            },
            {
                label: '送货单', value: 3,
                tip: '对应总金额最大的一份订货合同提供送货单'
            },
            {
                label: '订货合同', value: 4,
                tip: '提供总金额最大的一份订货合同（订单）'
            },
            {
                label: '其他文件', value: 5,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '设计类', value: 5, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程 + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '设计付款进度确认表', value: 2,
                tip: '1. 包含相关责任人签字 2. 本次请款不能包含预付款部分'
            },
            {
                label: '其他文件', value: 3,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '设备供应类', value: 6, children: [
            {
                label: '资金计划', value: 1,
                tip: 'ERP 审批流程 + 具体资金计划明细（明细页圈出本笔业务)'
            },
            {
                label: '送货单', value: 2,
                tip: '1. 货物明细与到货验收单及资金计划有对应关系2. 供应商加盖公章'
            },
            {
                label: '到货验收单', value: 3,
                tip: '1. 货物明细与送货单及资金计划有对应关系2. 甲方相关责任人签字'
            },
            {
                label: '其他文件', value: 4,
                tip: '如有补充资料可增加，如无可留空'
            },
        ]
    },
    {
        label: '其他类', value: 7, children: [
            { label: '其他文件', value: 1 },
        ]
    },
]


@Component({
    templateUrl: './upload-lvyuefile-modal.component.html',
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

// 上传履约证明文件
export class UploadLyFileModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    public params: EditParamInputModel = new EditParamInputModel();
    private observer: any;
    public mainForm: FormGroup;
    // 履约证明文件类别配置
    public selectOptions: any[] = selectOptions;
    // 选择的文件类别
    public fileType: any = '';
    // 文件子类别
    public childrenChecker: any[] = [];
    // 表头
    public heads: any[] = heads;
    // 表格数据
    public tableInfo: any[] = [];
    public headLeft: number;

    constructor(private xn: XnService) { }

    open(params: EditParamInputModel): Observable<any> {
        this.params = Object.assign({}, this.params, params);
        this.tableInfo = this.params.tableInfo
        // 展示文件
        if (this.params.type !== 'upload') {
            this.showView()
        }
        this.modal.open(this.params.size);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  查看文件
     * @param 
     */
    showView() {
        const performanceFile: any[] = this.params.params; // 履约证明文件
        this.fileType = performanceFile[0]['firstPerformanceType'];
        this.childrenChecker = [];
        // 文件子类别
        const secondOptions: any[] = this.selectOptions.filter(v => v.value === Number(this.fileType))[0]['children'];
        //根据选择的一级文件列表 动态组装二级checker配置
        secondOptions.map(v => {
            let checker = {
                title: v.label, checkerId: `uploadFile${v.value}`, type: 'agileMfile', required: false,
                options: { "fileext": "jpg, jpeg, png, pdf, xlsx, xls", readonly: this.params.type === 'view' ? true : false },
                other: v.tip
            }
            checker['value'] = [];
            // 通过二级标识 secondPerformanceType 设置value值
            performanceFile.map(x => {
                if (x['secondPerformanceType'] === v.value) {
                    checker['value'].push(x)
                }
            })
            checker['value'] = checker['value'].length > 0 ? JSON.stringify(checker['value']) : '';
            this.childrenChecker.push(checker)
        })
        this.buildChecker(this.childrenChecker);
        this.mainForm = XnFormUtils.buildFormGroup(this.childrenChecker);
    }

    /**
     *  选择文件类别
     * @param event select Event
     */
    fileTypeChange(event: any) {
        this.fileType = event.target.value;
        if (this.fileType) {
            this.childrenChecker = [];
            // 文件子类别
            const secondOptions: any[] = this.selectOptions.filter(v => v.value === Number(this.fileType))[0]['children'];
            //根据选择的一级文件列表 动态组装二级checker配置
            secondOptions.map(v => {
                const checker = {
                    title: v.label, checkerId: `uploadFile${v.value}`, type: 'agileMfile', value: '',
                    options: { "fileext": "jpg, jpeg, png, pdf, xlsx, xls", }, required: false,
                    other: v.tip
                }
                this.childrenChecker.push(checker)
            })
            this.buildChecker(this.childrenChecker);
            this.mainForm = XnFormUtils.buildFormGroup(this.childrenChecker);
        } else {
            this.mainForm = undefined
        }
    }

    /**
     *  提交
     */
    public handleSubmit() {
        const formValue = { ...this.mainForm.value };
        if (Object.keys(formValue).every(v => !formValue[v])) { this.xn.msgBox.open(false, '至少需要上传一项文件') };

        let performanceFileList: any[] = []; // 履约证明文件列表 JSON数组
        for (const key in formValue) {
            if (!!formValue[key]) {
                JSON.parse(formValue[key]).forEach((file: any) => {
                    // 给上传的文件添加 performanceType 文件类型
                    file['firstPerformanceType'] = Number(this.fileType); // 一级类别标志
                    file['secondPerformanceType'] = Number(key.split('uploadFile')[1]); // 二级类别标志
                    performanceFileList.push(file)
                });
            }
        }
        if (performanceFileList.length > 0) {
            // 提交履约证明文件
            this.xn.loading.open();
            this.xn.dragon.post('/sub_system/yjl_system/project_performance_upload',
                {
                    mainFlowId: this.params.mainFlowId, // 交易id
                    performanceFile: JSON.stringify(performanceFileList) // 履约证明文件列表
                })
                .subscribe(t => {
                    this.xn.loading.close();
                    if (t.ret === 0) {
                        this.xn.msgBox.open(false, '文件上传成功');
                        this.close({ action: true })
                    }
                })
        } else { return }
    }

    /**
     *  取消
     */
    public handleCancel() {
        this.close(null);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }
}