import { XnUtils } from './xn-utils';
import { SelectOptions } from '../config/select-options';
import { isNullOrUndefined } from 'util';
import { XnFormUtils } from './xn-form-utils';

/**
 * 与流程相关的操作
 */
export default class XnFlowUtils {

    static formatOperator(operator, procedureId): string {
        switch (operator) {
            case 1:
                return (procedureId === '@begin' ? '提交' : '审核通过');
            case 2:
                return '退回';
            case 3:
                return '中止';
            default:
                return `${operator}`;
        }
    }
    static forMartMoney(data): string {
        const mineyFixed = Number(data).toFixed(2);
        return mineyFixed;

    }

    /**
     * 将 [{label:'是',value:'1',children:[{...}]}]枚举转换根据value 值显示label 标签
     * 或者 string : ref 键值对在select-options 中的配置属性名
     * @param value
     * @param param
     */
    static fnTransform(value: { proxy: any, status: any }, param: string): string {
        if (!param || !value || value && !value.status) {
            return '';
        }
        const obj = $.extend(true, {}, value);
        const currentLabel = SelectOptions.getLabel(SelectOptions.get(param), Number(obj.proxy));
        const hasChildren = SelectOptions.get(param).filter((pro) => pro.children && pro.children.length).map((y) => y.value);
        const noChildren = SelectOptions.get(param).filter((pro) => !pro.children || pro.children && !pro.children.length).map((y) => y.value);
        if (noChildren.includes(Number(obj.proxy))) {
            return '';
        } else if (hasChildren.includes(Number(obj.proxy))) {
            const children = SelectOptions.get(param).find((pro) => pro.value === Number(obj.proxy)).children;
            const chidLabel = children.find((child) => child.value === Number(obj.status)).label;
            return chidLabel;
        } else {
            return '';
        }
    }

    /**
     * 根据不同的模式，匹配主流程记录
     * @param paramsProxy 交易模式
     * @param paramsCurrentStep 当前交易步骤
     */
    static formatStatus(paramsProxy, paramsCurrentStep): string {
        let currentLabel = '';
        switch (paramsProxy) {
            case 0:
            case 1:
            case 2:
                currentLabel = this.formatMainFlowStatus(paramsCurrentStep);
                break;
            case 3:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'standardFactoring1'); // 标准保理
                break;
            case 5:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'oldGemdaleStatus'); // 老金地
                break;
            case 6:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'standardFactoring'); // 标准万科
                break;
            case 11:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'direAgreementSigningStatus'); // 定向支付-签约
                break;
            case 12:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'formatDireFlowChangeStatus'); // 定向支付-协议修改
                break;
            case 13:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'direApplyLoadStatus'); // 定向支付-申请融资
                break;
            case 14:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'gemdaleflowStatus'); // 金地abs
                break;
            // 采购融资万科供应商发起申请
            case 50:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'avengerSupplier'); //
                break;
            // 采购融资签署合作协议流程
            case 51:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'avengerTranactionSignStatus');
                break;
            // 龙光
            case 52:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'dragonType');
                break;
            // 新万科
            case 53:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'newVankeType');
                break;
            // 龙光和万科
            case 5253:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'currentStep');
                break;
            // 上海银行
            case 60:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'currentStep_sh');
                break;
            // 华侨城-上海银行
            case 61:
                currentLabel = this.formatMainFlowStatus1(paramsCurrentStep, 'currentStep_so');
                break;

        }
        return currentLabel;
    }
    // // 应收账款类型
    // static getMainmoneytype(type:any):string{

    // }

    /**
     *  基础模式
     * @param paramsCurrentStep
     */
    static formatMainFlowStatus(paramsCurrentStep: any): string {
        if (XnUtils.isEmpty(paramsCurrentStep)) {
            return '';
        } else {
            return SelectOptions.getConfLabel('mainFlowStatus', paramsCurrentStep.toString());
        }
    }

    /**
     *  企业注册状态
     * @param type : number
     */
    static formatRegisterStatus(type: number): string {
        return !XnUtils.isEmpty(type) ? SelectOptions.getConfLabel('registerStatus', type.toString()) : '';
    }

    /**
     *  其他模式当前步骤匹配
     * @param paramsCurrentStep
     * @param paramsKey
     */
    static formatMainFlowStatus1(paramsCurrentStep: any, paramsKey: string): string {
        if (XnUtils.isEmpty(paramsCurrentStep)) {
            return '';
        } else {
            return SelectOptions.getConfLabel(paramsKey, paramsCurrentStep.toString());
        }
    }

    static formatDepositMainFlowStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('depositMainFlowStatus', type.toString());
        } else {
            return '';
        }
    }

    // 匹配交易模式
    static formatProxyStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('proxyStatus', type.toString());
        } else {
            return '';
        }
    }
    // 采购融资万科供应商发起申请
    // static formatAvengerProxyStatus(type) {
    //     if (!XnUtils.isEmpty(type)) {
    //         return SelectOptions.getConfLabel('avengerSupplier', type.toString());
    //     } else {
    //         return '';
    //     }
    // }
    // 采购融资签署合作协议流程
    static formatAvengerSignProxyStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('avengerTranactionSignStatus', type.toString());
        } else {
            return '';
        }
    }


    static formatIsUseQuotaStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('isUseQuota', type);
        } else {
            return '';
        }
    }

    static formatDcTypeStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('dcType', type.toString());
        } else {
            return '';
        }
    }

    static formatHeadquarters(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('abs_headquarters', type.toString());
        } else {
            return '';
        }
    }

    static formatAdditionalMaterials(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('additionalMaterials', type.toString());
        } else {
            return '';
        }
    }

    static formatContractType(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('contractType_jban', type.toString());
        } else {
            return '';
        }
    }

    /**
     *  是否已签署应收账款金额  雅居乐补充协议
     * @param type
     */
    static formatIsSign(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('caApply', type.toString());
        } else {
            return '';
        }
    }

    /**
     *  补充协议状态
     * @param type
     */
    static formatSupplementaryAgreementStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('supplementaryAgreementStatus', type.toString());
        } else {
            return '';
        }
    }

    static formatXnYjlIsResignStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return type.toString() === '13' ? '是' : '否';
        } else {
            return '';
        }
    }

    static formatRecordStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('recordStatus', type.toString());
        } else {
            return '';
        }
    }

    /**
     *  匹配状态码对应状态
     * @param key 状态码对应枚举 关键字
     * @param type 状态吗
     */
    static formatRecordEveryStatus(key, type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel(key, type.toString());
        } else {
            return '';
        }
    }

    // 首页系统消息状态
    static formatReadStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('readStatus', type.toString());
        } else {
            return '';
        }
    }

    static formatTaxtypeStatus(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('taxType', type.toString());
        } else {
            return '';
        }
    }

    static formatProxyType(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('proxyType', type.toString());
        } else {
            return '';
        }
    }

    // 资金渠道
    static formatMoneyChannel(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('moneyChannel', type.toString());
        } else {
            return '';
        }
    }

    static formatIsInit(type) {
        if (!XnUtils.isEmpty(type)) {
            return SelectOptions.getConfLabel('isInit', type.toString());
        } else {
            return '';
        }
    }

    static handleSvrConfig(svrConfig: any): any {
        // 处理checker
        if (svrConfig.checkers) {
            for (const checker of svrConfig.checkers) {
                XnFormUtils.convertChecker(checker, svrConfig);
            }
        }

        if (svrConfig.actions) {
            for (const action of svrConfig.actions) {
                for (const checker of action.checkers) {
                    XnFormUtils.convertChecker(checker, svrConfig);
                }
            }
        }
        return svrConfig;
    }
    /**
     * 构建表单提交 checkers 数据
     * @param  {any} checkers
     * @param  {any} formValue
     */
    static buildSubmitCheckers(checkers: any, formValue: any): any {
        const ret = {} as any;
        for (const row of checkers) {
            if (isNullOrUndefined(row.checkerId)) {
                continue;
            }
            // 现在formValue里全是string了，所以不需要再处理，直接赋值即可
            ret[row.checkerId] = formValue[row.checkerId];
        }
        return ret;
    }

    /**
     * 获取svrConfig.checkers中，指定name的默认值
     * @param svrConfig
     * @param name
     * @returns {any}
     */
    static getDefaultValueByName(svrConfig: any, name: string): any {
        for (const checker of svrConfig.checkers) {
            if (checker.checkerId === name) {
                return checker.options.value;
            }
        }

        return null;
    }

    /**
     * 根据流程ID显示流程进度组件
     * @param flowId
     */
    static calcFlowProcess(flowId: string): { show: boolean, steped: number | null, proxy: number | null } {
        switch (flowId) {
            case 'supplier_finance': // 财务资料
                return { show: true, steped: null, proxy: null };
            // 基础模式
            case 'financing':
                return { show: true, steped: 0, proxy: 0 };
            case 'financing_platform':
                return { show: true, steped: 1, proxy: 0 };
            case 'financing_factoring':
                return { show: true, steped: 2, proxy: 0 };
            case 'financing_supplier':
                return { show: true, steped: 3, proxy: 0 };
            case 'factoring_loan':
                return { show: true, steped: 4, proxy: 0 };
            case 'supplier_endorse':
                return { show: true, steped: 5, proxy: 0 };
            case 'factoring_endorse':
                return { show: true, steped: 5, proxy: 0 };
            case 'factoring_repayment':
                return { show: true, steped: 6, proxy: 0 };

            // 委托模式
            case 'financing2':
                return { show: true, steped: 0, proxy: 2 };
            case 'financing_platform2':
                return { show: true, steped: 1, proxy: 2 };
            case 'financing_factoring2':
                return { show: true, steped: 2, proxy: 2 };
            case 'financing_supplier2':
                return { show: true, steped: 3, proxy: 2 };
            case 'factoring_loan2':
                return { show: true, steped: 4, proxy: 2 };
            case 'supplier_endorse2':
                return { show: true, steped: 5, proxy: 2 };
            case 'factoring_endorse2':
                return { show: true, steped: 5, proxy: 2 };

            // 回购模式
            case 'financing1':
                return { show: true, steped: 0, proxy: 1 };
            case 'financing_platform1':
                return { show: true, steped: 1, proxy: 1 };
            case 'financing_factoring1':
                return { show: true, steped: 2, proxy: 1 };
            case 'financing_supplier1':
                return { show: true, steped: 3, proxy: 1 };
            case 'factoring_loan1':
                return { show: true, steped: 4, proxy: 1 };
            case 'supplier_endorse1':
                return { show: true, steped: 5, proxy: 1 };

            // 标准保理（万科1.0）
            case 'financing3':
                return { show: true, steped: 0, proxy: 3 };
            case 'financing_platform3':
                return { show: true, steped: 1, proxy: 3 };
            case 'financing_factoring3':
                return { show: true, steped: 2, proxy: 3 };
            case 'financing_supplier3':
                return { show: true, steped: 3, proxy: 3 };
            case 'factoring_loan3':
                return { show: true, steped: 4, proxy: 3 };
            case 'supplier_endorse3':
                return { show: true, steped: 5, proxy: 3 };
            case 'factoring_loan_real3':
                return { show: true, steped: 6, proxy: 3 };

            // 标准保理（万科2.0）


            // 标准保理（万科3.0）
            case 'financing_pre6':
                return { show: true, steped: 0, proxy: 6 };
            case 'financing6':
                return { show: true, steped: 1, proxy: 6 };
            case 'financing_supplier6':
                return { show: true, steped: 2, proxy: 6 };

            // 银行直贴（保证付款-商品融资）
            case 'financing7':
                return { show: true, steped: 0, proxy: 7 };
            case 'financing_platform7':
                return { show: true, steped: 1, proxy: 7 };
            case 'financing_factoring7':
                return { show: true, steped: 2, proxy: 7 };
            case 'financing_supplier7':
                return { show: true, steped: 3, proxy: 7 };
            case 'financing_bank7':
                return { show: true, steped: 4, proxy: 7 };

            // 标准保理-金地
            case 'financing_pre5':
                return { show: true, steped: 0, proxy: 5 };
            case 'financing5':
                return { show: true, steped: 1, proxy: 5 };
            case 'financing_platform5':
                return { show: true, steped: 2, proxy: 5 };
            case 'financing_factoring5':
                return { show: true, steped: 3, proxy: 5 };
            case 'financing_supplier5':
                return { show: true, steped: 4, proxy: 5 };
            case 'financing_project5':
                return { show: true, steped: 5, proxy: 5 };
            case 'financing_factoring_two5':
                return { show: true, steped: 6, proxy: 5 };
            case 'financing_supplier_two5':
                return { show: true, steped: 7, proxy: 5 };
            case 'financing_loan5':
                return { show: true, steped: 8, proxy: 5 };
            case 'financing_jd5':
                return { show: true, steped: 9, proxy: 5 };
            case 'financing_wk5':
                return { show: true, steped: 10, proxy: 5 };

            // 定向收款模式- 定向收款托管协议签约
            case 'financing11':
                return { show: true, steped: 0, proxy: 11 };
            case 'financing_platform11':
                return { show: true, steped: 1, proxy: 11 };
            case 'financing_factoring11':
                return { show: true, steped: 2, proxy: 11 };
            case 'financing_bank11':
                return { show: true, steped: 3, proxy: 11 };
            case 'financing_factoring_addmsg11':
                return { show: true, steped: 4, proxy: 11 };

            // 定向收款模式- 定向收款托管变更协议、终止
            case 'financing12':
                return { show: true, steped: 0, proxy: 12 };
            case 'financing_factoring12':
                return { show: true, steped: 1, proxy: 12 };
            case 'financing_bank12':
                return { show: true, steped: 2, proxy: 12 };
            case 'financing_factoring_uploadmsg12':
                return { show: true, steped: 3, proxy: 12 };

            // 定向收款模式- 申请融资流程
            case 'financing_pre13':
                return { show: true, steped: 0, proxy: 13 };
            case 'financing13':
                return { show: true, steped: 1, proxy: 13 };
            case 'financing_factoring13':
                return { show: true, steped: 2, proxy: 13 };
            case 'financing_factoring_loan13':
                return { show: true, steped: 3, proxy: 13 };
            case 'financing_confirm_loan13':
                return { show: true, steped: 4, proxy: 13 };

            // 金地abs3.0 流程标签
            case 'financing_pre14':
                return { show: true, steped: 0, proxy: 14 };
            case 'financing14':
                return { show: true, steped: 1, proxy: 14 };
            case 'financing_supplier14':
                return { show: true, steped: 2, proxy: 14 };

            // 企业上传基本资料
            case 'upload_base':
                return { show: true, steped: 0, proxy: 1001 };
            case 'upload_base_platform':
                return { show: true, steped: 1, proxy: 1001 };

            default:
                return { show: false, steped: 0, proxy: 0 };
        }
    }

}
