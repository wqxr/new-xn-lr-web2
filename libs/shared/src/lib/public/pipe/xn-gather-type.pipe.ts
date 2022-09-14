import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({ name: 'xnGatherType' })
export class XnGatherTypePipe implements PipeTransform {
    transform(data: any, obj?: any): string {
        obj = this.adapterObj(obj, data);
        if (!(obj && obj.head && obj.head.hasOwnProperty('type')) || (!data && data !== 0)) {
            return data || '';
        }

        const iniType = obj.head.type;
        let type = '';

        if (iniType === 'radio') {
            type = obj.head.options && obj.head.options.ref || iniType;
        } else {
            type = iniType;
        }

        switch (type) {
            case 'date':
                return XnUtils.formatDate(data);
            case 'dateTime':
                return XnUtils.formatDatetime(data);
            case 'longDateTime':
                return XnUtils.formatLongDatetime(data);
            case 'stringToDate':
                const date = XnUtils.toDate(data);
                return XnUtils.formatDate(Date.parse(date));
            case 'money':
                data = data.toString();
                return XnUtils.formatMoneyFloat(data);
            // case 'moreselect':

            //     console.info(data,"erer");
            //     return XnFlowUtils.getMainmoneytype(data);
            case 'xnMainFlowStatus':
                return XnFlowUtils.formatStatus(obj.row.isProxy, data);
            case 'xnDepositMainFlowStatus':
                return XnFlowUtils.formatDepositMainFlowStatus(data);
            case 'xnProxyStatus':
                return XnFlowUtils.formatProxyStatus(data);
            case 'xnRecordStatus':
                return XnFlowUtils.formatRecordStatus(data);
            case 'taxType':
                return XnFlowUtils.formatTaxtypeStatus(data);
            case 'isInit':
                return XnFlowUtils.formatIsInit(data);
            case 'br':
                return XnUtils.brData(data);
            case 'dcType':
                return XnFlowUtils.formatDcTypeStatus(data);
            case 'xnMoneyChannel':
                return XnFlowUtils.formatMoneyChannel(data);
            case 'xnReadStatus':
                return XnFlowUtils.formatReadStatus(data);
            case 'headquarters':
                return XnFlowUtils.formatHeadquarters(data);
            case 'additionalMaterials':
                return XnFlowUtils.formatAdditionalMaterials(data);
            case 'xnContractType':
                return XnFlowUtils.formatContractType(data);
            case 'xnCaApply':
                return XnFlowUtils.formatIsSign(data);
            case 'xnSupplementaryAgreementStatus':
                return XnFlowUtils.formatSupplementaryAgreementStatus(data);
            case 'standardFactoring':
                return XnFlowUtils.formatStatus(6, data); // 地产供应链交易类型 6 此处特殊情况，固定为万科模式
            case 'xnYjlIsResignStatus':
                return XnFlowUtils.formatXnYjlIsResignStatus(data); // 特殊处理 是：13，其他：否
            case 'xnRegisterStatusPipe':
                return XnFlowUtils.formatRecordEveryStatus('registerStatus', data);
            case 'XnAvengerTransactionStatus':
                return XnFlowUtils.formatMainFlowStatus1('avengerTransactionStatus', data); // 采购融资交易映射
            case 'backStatus':
                return XnFlowUtils.formatRecordEveryStatus('backStatus', data);
            case 'fitResult':
                return XnFlowUtils.formatRecordEveryStatus('fitResult', data);
            case 'moneyback':
                return XnFlowUtils.formatRecordEveryStatus('moneyback', data);
            case 'IsbackMoney':
                return XnFlowUtils.formatRecordEveryStatus('IsbackMoney', data);
            case 'approvalMethod':
                return XnFlowUtils.formatRecordEveryStatus('approvalMethod', data);
            case 'Certificateperformance':
                return XnFlowUtils.formatRecordEveryStatus('Certificateperformance', data); // 履约证明类型
            case 'payback':
                return XnFlowUtils.formatRecordEveryStatus('payback', data); // 还款状态
            case 'platowner':
                return XnFlowUtils.formatRecordEveryStatus('platowner', data); // 平台初审履约证明上传方
            case 'proxyType':
                return XnFlowUtils.formatRecordEveryStatus('proxyType', data);
            case 'spIsProxys':
                return XnFlowUtils.formatRecordEveryStatus('spIsProxys', data);
            case 'payback':
                return XnFlowUtils.formatRecordEveryStatus('payback', data);
            case 'zhongdengStatus':
                return XnFlowUtils.formatRecordEveryStatus('zhongdengStatus', data);
            case 'accountReceipts':
                return XnFlowUtils.formatRecordEveryStatus('accountReceipts', data);
            case 'isInit':
                return XnFlowUtils.formatRecordEveryStatus('isInit', data);
            case 'isLawOfficeCheck':
                return XnFlowUtils.formatRecordEveryStatus('isLawOfficeCheck', data);
            case 'defaultRadio':
                return XnFlowUtils.formatRecordEveryStatus('defaultRadio', data);
            case 'tradeStatus':
                return XnFlowUtils.formatRecordEveryStatus('tradeStatus', data);
            case 'dragonContracttype':
                return XnFlowUtils.formatRecordEveryStatus('dragonContracttype', data);
            case 'productType':
                return XnFlowUtils.formatRecordEveryStatus('productType', data);
            case 'correctMoney':
                return XnFlowUtils.forMartMoney(data);
            case 'currentStep':
                return XnFlowUtils.formatRecordEveryStatus('currentStep', data);
        }

        return data;

    }

    /**
     * 统一 obj 类型是 {head: any, row: any}
     */
    private adapterObj(obj, data): { head: any, row: any } {
        if (obj && obj.type) {
            this.hasValue(obj, 'head', obj);
            this.hasValue(obj.head, 'type', obj.type);
            this.hasValue(obj, 'row', obj);
            this.hasValue(obj.row, 'isProxy', data);
        }

        return obj;
    }
    // 金钱格式化
    public correcttoFixed() {

    }

    /**
     * 若对象没有属性，则添加该属性且设置其值
     * @param obj 对象
     * @param key 属性
     * @param value 默认值
     */
    private hasValue(obj, key, value) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    }
}
