import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

/**
 * 两票一合同-保理商初审时 审核标准
 */
@Component({
    templateUrl: './audit-criteria-modal.component.html',
    styles: [`
        .box-border {
            border-bottom: 1px solid #cecece;
        }

        .margin-c {
            margin: 10px auto;
            /*width: 80%;*/
        }

        .fail-color {
            color: #c50000;
        }

        .pass-color {
            color: #0e70b7;
        }

        .notice-color {
            color: #cbcbcb;
        }

        .flex {
            display: flex;
        }

        .flex-title {
            flex: 1;
        }

        .flex-title p:first-child {
            font-weight: bold;
        }

        .box-x {
            text-align: center;
            padding: 10px;
        }

        .font-warp {
            word-break: break-all;
        }

        @media (max-height: 1000px) {
            .box-modal {
                max-height: 600px
            }
        }

        @media (max-height: 900px) {
            .box-modal {
                max-height: 500px
            }
        }

        @media (max-height: 800px) {
            .box-modal {
                max-height: 400px
            }
        }

        @media (max-height: 700px) {
            .box-modal {
                max-height: 300px
            }
        }
    `]
})
export class AuditCriteriaModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    params: OutputModal = new OutputModal();
    examData: any[] = [];

    viewIndex: boolean;
    viewIndex1: boolean;


    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<string> {
        this.xn.loading.open();
        this.initPage();
        this.xn.api.post('/yb/exam/exam_financing/get_exam_data', {
            mainFlowId: params.mainFlowId,
            payTime: params.payTime
        }).subscribe(x => {
            if (x.ret === 0 && !!x.data) {
                this.params = x.data;
                this.showData(x.data);
                this.viewIndex = this.params.financingAccount === this.params.baseAccount;
                this.viewIndex1 = this.params.sendAccount === this.params.baseAccount;
                this.xn.loading.close();
            }
        });


        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    showData(data) {
        this.examData.forEach(exam => {
            exam.valueLeft = data[exam.idLeft];
            exam.valueRight = data[exam.idRight];
            exam.valueCenter = data[exam.idLeft].toString() === data[exam.idRight].toString() ? '等于' : '不等于';
            exam.color = data[exam.idLeft].toString() === data[exam.idRight].toString() ? 'pass-color' : 'fail-color';
            // 如果两边都是空的则一律不显示比较
            if ((data[exam.idLeft] === '' || data[exam.idLeft].length === 0)
                && (data[exam.idRight] === '' || data[exam.idRight].length === 0)) {
                exam.display = false;
            }
        });
        this.examData.forEach(exam => {
            // 应收账款日期-销售合同有效期、发票开票日期-保理申请日期、商票出票日期-保理申请日期
            if (exam.idLeft === 'payTime' && exam.idRight === 'contractValidTime'
                || exam.idLeft === 'invoiceDate' && exam.idRight === 'financingStart'
                || exam.idLeft === 'honourStart' && exam.idRight === 'financingStart') {
                if (exam.valueLeft.length === 1 && exam.valueRight.length === 1) {
                    exam.display = true;
                    this.calcExam(exam.valueLeft[0], exam.valueRight[0], exam, true);
                } else if (exam.valueLeft.length === 1 && exam.valueRight.length > 1) {
                    exam.display = true;
                    // 如果所有元素都相等怎村子-左右两边想等
                    const find = exam.valueRight.find((x: any) => x !== exam.valueRight[0]);
                    // 找出右边最小的值
                    const min = exam.valueRight.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num2 : num1;
                    });
                    if (find) {
                        this.calcExam(exam.valueLeft[0], min, exam, false);
                    } else {
                        this.calcExam(exam.valueLeft[0], min, exam, true);
                    }
                } else if (exam.valueLeft.length > 1 && exam.valueRight.length === 1) {
                    exam.display = true;
                    const find = exam.valueLeft.find((x: any) => x !== exam.valueLeft[0]);
                    // 找出左边最大的值
                    const max = exam.valueLeft.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num1 : num2;
                    });
                    if (find) {
                        this.calcExam(max, exam.valueRight[0], exam, false);
                    } else {
                        this.calcExam(max, exam.valueRight[0], exam, true);
                    }
                } else if (exam.valueLeft.length > 1 && exam.valueRight.length > 1) {
                    exam.display = true;
                    // 找出左边最大的值
                    const maxLeft = exam.valueLeft.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num1 : num2;
                    });
                    // 找出右边最小的值
                    const minRight = exam.valueRight.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num2 : num1;
                    });
                    const findRight = exam.valueRight.find((x: any) => x !== exam.valueRight[0]);
                    const findLeft = exam.valueLeft.find((x: any) => x !== exam.valueLeft[0]);
                    if (findLeft && findRight) {
                        this.calcExam(maxLeft, minRight, exam, false);
                    } else {
                        this.calcExam(maxLeft, minRight, exam, true);
                    }
                } else {
                    exam.display = false;
                }
            }
            // 发票开票日期（左）-合同签订日期（右）
            // 1.左边一个日期-右边1个日期（直接比较）
            // 2.左边一个日期-右边多个日期（左边日期-右边最早日期-找出最小的数、多项元素都想等下存在等于，否则没有等于）
            // 3.左边多个日期-右边一个日期（最晚日期、最大日期-比较、没有等于、多项元素都想等下存在等于，否则没有等于）
            // 4.左边多个日期-右边多个日期（最晚日期-比较最早日期、没有等于、多项元素都想等下存在等于，否则没有等于）
            // 5.左边没有-右边没有（不比较）
            if (exam.idLeft === 'invoiceDate' && exam.idRight === 'contractSignTime') {
                if (exam.valueLeft.length === 1 && exam.valueRight.length === 1) {
                    exam.display = true;
                    this.calcExam1(exam.valueLeft[0], exam.valueRight[0], exam, true);
                } else if (exam.valueLeft.length === 1 && exam.valueRight.length > 1) {
                    exam.display = true;
                    // 如果所有元素都相等怎村子-左右两边想等
                    const find = exam.valueRight.find((x: any) => x !== exam.valueRight[0]);
                    // 找出右边最小的值
                    const min = exam.valueRight.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num2 : num1;
                    });
                    if (find) {
                        this.calcExam1(exam.valueLeft[0], min, exam, false);
                    } else {
                        this.calcExam1(exam.valueLeft[0], min, exam, true);
                    }
                } else if (exam.valueLeft.length > 1 && exam.valueRight.length === 1) {
                    exam.display = true;
                    const find = exam.valueLeft.find((x: any) => x !== exam.valueLeft[0]);
                    // 找出左边最大的值
                    const max = exam.valueLeft.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num1 : num2;
                    });
                    if (find) {
                        this.calcExam1(max, exam.valueRight[0], exam, false);
                    } else {
                        this.calcExam1(max, exam.valueRight[0], exam, true);
                    }
                } else if (exam.valueLeft.length > 1 && exam.valueRight.length > 1) {
                    exam.display = true;
                    // 找出左边最大的值
                    const maxLeft = exam.valueLeft.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num1 : num2;
                    });
                    // 找出右边最小的值
                    const minRight = exam.valueRight.reduce((num1, num2) => {
                        return new Date(this.calcDate(num1)) > new Date(this.calcDate(num2)) ? num2 : num1;
                    });
                    const findRight = exam.valueRight.find((x: any) => x !== exam.valueRight[0]);
                    const findLeft = exam.valueLeft.find((x: any) => x !== exam.valueLeft[0]);
                    if (findLeft && findRight) {
                        this.calcExam1(maxLeft, minRight, exam, false);
                    } else {
                        this.calcExam1(maxLeft, minRight, exam, true);
                    }
                } else {
                    exam.display = false;
                }
            }
            // 应收账款金额对比合同金额
            if (exam.idLeft === 'honourAmount' && exam.idRight === 'contractAmount') {
                if (parseFloat(exam.valueLeft[0]) < parseFloat(exam.valueRight[0])) {
                    exam.valueCenter = '小于';
                    exam.color = 'pass-color';
                } else if (parseFloat(exam.valueLeft[0]) > parseFloat(exam.valueRight[0])) {
                    exam.valueCenter = '大于';
                    exam.color = 'fail-color';
                } else {
                    exam.valueCenter = '等于';
                    exam.color = 'pass-color';
                }
            }
            // 发票金额对比商票金额
            if (exam.idLeft === 'invoiceAmount' && exam.idRight === 'honourAmount') {
                if (parseFloat(exam.valueLeft[0]) < parseFloat(exam.valueRight[0])) {
                    exam.valueCenter = '小于';
                    exam.color = 'fail-color';
                } else if (parseFloat(exam.valueLeft[0]) > parseFloat(exam.valueRight[0])) {
                    exam.valueCenter = '大于';
                    exam.color = 'pass-color';
                } else {
                    exam.valueCenter = '等于';
                    exam.color = 'pass-color';
                }
            }
            // 核心企业名称-合同购买方/合同销售方
            if (exam.idLeft === 'enterprise' && exam.idRight === 'contractBuySale'
                || exam.idLeft === 'honourMan' && exam.idRight === 'contractBuyer') {
                const value = this.splitString(exam.valueRight.toString());
                if (value.length) {
                    const find = value.find((x: any) => x === exam.valueLeft.toString());
                    if (find) {
                        exam.valueCenter = '等于';
                        exam.color = 'pass-color';
                    } else {
                        exam.valueCenter = '不等于';
                        exam.color = 'fail-color';
                    }
                } else {
                    exam.valueCenter = '不等于';
                    exam.color = 'fail-color';
                }
            }
            // 发票开票人-合同销售名称
            if (exam.idLeft === 'inoviceGiver' && exam.idRight === 'contractSaler'
                || exam.idLeft === 'invoiceReceiver' && exam.idRight === 'contractBuyer') {
                const value = this.splitString(exam.valueLeft.toString());
                if (value.length) {
                    const find = value.find((x: any) => x !== exam.valueRight.toString());
                    if (find) {
                        exam.valueCenter = '不等于';
                        exam.color = 'fail-color';
                    } else {
                        exam.valueCenter = '等于';
                        exam.color = 'pass-color';
                    }
                } else {
                    exam.valueCenter = '不等于';
                    exam.color = 'fail-color';
                }
            }
        });
        // 数组转字符串
        this.examData.forEach(ex => {
            if (ex.valueLeft instanceof Array) {
                ex.valueLeft = ex.valueLeft.join(',');
            }
            if (ex.valueRight instanceof Array) {
                ex.valueRight = ex.valueRight.join(',');
            }
        });

    }

    initPage() {
        this.examData.push({
            idLeft: 'payTime',
            titleLeft: '应收账款转让日期',
            valueLeft: '',
            titleCenter: '参考标准：早于、等于',
            valueCenter: '',
            color: '',
            idRight: 'contractValidTime',
            titleRight: '销售合同有效期',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'invoiceDate',
            titleLeft: '发票开票日期',
            valueLeft: '',
            titleCenter: '参考标准：晚于、等于',
            valueCenter: '',
            color: '',
            idRight: 'contractSignTime',
            titleRight: '合同签订日期',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'invoiceDate',
            titleLeft: '发票开票日期',
            valueLeft: '',
            titleCenter: '参考标准：早于、等于',
            valueCenter: '',
            color: '',
            idRight: 'financingStart',
            titleRight: '保理申请日期',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'honourStart',
            titleLeft: '商票出票日期',
            valueLeft: '',
            titleCenter: '参考标准：早于、等于',
            valueCenter: '',
            color: '',
            idRight: 'financingStart',
            titleRight: '保理申请日期',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'honourAmount',
            titleLeft: '应收账款转让金额',
            valueLeft: '',
            titleCenter: '参考标准：小于、等于',
            valueCenter: '',
            color: '',
            idRight: 'contractAmount',
            titleRight: '销售合同金额',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'invoiceAmount',
            titleLeft: '发票金额',
            valueLeft: '',
            titleCenter: '参考标准：大于、等于',
            valueCenter: '',
            color: '',
            idRight: 'honourAmount',
            titleRight: '商票金额',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'inoviceGiver',
            titleLeft: '发票开票人',
            valueLeft: '',
            titleCenter: '参考标准：等于',
            valueCenter: '',
            color: '',
            idRight: 'contractSaler',
            titleRight: '合同销售方名称',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'invoiceReceiver',
            titleLeft: '发票收票人',
            valueLeft: '',
            titleCenter: '参考标准：等于',
            valueCenter: '',
            color: '',
            idRight: 'contractBuyer',
            titleRight: '合同购买方名称',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'enterprise',
            titleLeft: '核心企业名称',
            valueLeft: '',
            titleCenter: '参考标准：等于',
            valueCenter: '',
            color: '',
            idRight: 'contractBuySale',
            titleRight: '合同购买方/合同销售方',
            valueRight: '',
            display: true
        });
        this.examData.push({
            idLeft: 'honourMan',
            titleLeft: '商票承兑人',
            valueLeft: '',
            color: '',
            titleCenter: '参考标准：等于',
            valueCenter: '',
            idRight: 'contractBuyer',
            titleRight: '合同购买方名称',
            valueRight: '',
            display: true
        });
    }

    failPass() {
        this.close(null);
    }

    successPass() {
        this.close('ok');
    }

    // cancel() {
    //     this.close(null);
    // }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    // 时间格式转化
    private calcDate(v: string) {
        if (v.indexOf('-') > -1) {
            return v;
        }
        return v.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    }

    // 拆分字符串-如果有不同符号，先用一种替换其他符号
    private splitString(v: string): string[] {
        if (v !== '') {
            if (v.indexOf('/') > -1) {
                return v.replace(/^[/]$/, ',').split(',');
            }
            return v.split(',');
        }
        return [];
    }

    // 参考标准-早于、等于
    private calcExam(left: any, right: any, exam: any, equal: boolean) {
        if (equal) {
            if (new Date(this.calcDate(left)).getTime() === new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '等于';
                exam.color = 'pass-color';
            } else if (new Date(this.calcDate(left)).getTime() > new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '晚于';
                exam.color = 'fail-color';
            } else {
                exam.valueCenter = '早于';
                exam.color = 'pass-color';
            }
        } else {
            if (new Date(this.calcDate(left)).getTime() <= new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '早于';
                exam.color = 'pass-color';
            } else {
                exam.valueCenter = '晚于';
                exam.color = 'fail-color';
            }
        }
    }

    // 参考标准-晚于、等于
    private calcExam1(left: any, right: any, exam: any, equal: boolean) {
        if (equal) {
            if (new Date(this.calcDate(left)).getTime() === new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '等于';
                exam.color = 'pass-color';
            } else if (new Date(this.calcDate(left)).getTime() > new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '晚于';
                exam.color = 'pass-color';
            } else {
                exam.valueCenter = '早于';
                exam.color = 'fail-color';
            }
        } else {
            if (new Date(this.calcDate(left)).getTime() >= new Date(this.calcDate(right)).getTime()) {
                exam.valueCenter = '晚于';
                exam.color = 'pass-color';
            } else {
                exam.valueCenter = '早于';
                exam.color = 'fail-color';
            }
        }

    }
}

export class OutputModal {
    payTime: string[]; // 应收账款转让日期
    contractValidTime: string[]; // 销售合同有效期
    contractSignTime: string[]; // 合同签订日期
    contractAmount: string[]; // 销售合同金额
    contractSaler: string[]; // 合同销售方名称
    contractBuyer: string[]; // 合同购买方名称
    invoiceDate: string[]; // 发票开票日期
    invoiceAmount: string[]; // 发票金额
    inoviceGiver: string[]; // 发票开票人
    invoiceReceiver: string[]; // 发票收票人
    financingStart: string[]; // 保理申请日期
    honourStart: string[]; // 商票出票日期
    honourAmount: string[]; // 商票金额
    honourMan: string[]; // 商票承兑人
    enterprise: string[]; // 核心企业名称
    financingAccount: string; // 企业发起业务时填写的账号
    baseAccount: string; // 基础合同约定的账号
    sendAccount: string; // 汇付数字证书费用的账号
}
