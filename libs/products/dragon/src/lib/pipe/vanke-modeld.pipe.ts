import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'VankemodelId' })
export class VankeModelId implements PipeTransform {
    transform(timestamp: any): string {
        switch (timestamp) {
            case 'dragon':
                return '龙光地产ABS业务流程';
            case 'verification':
                return '审批放款流程模式';
            case 'zd_register':
                return '中登登记';
            case 'person_match':
                return '人工匹配付款确认书';
            case 'replace_qrs':
                return '替换付款确认书';
            case 'change_add_contract':
                return '变更发行和补充协议流程';
            case 'change_capital_pool':
                return '变更资产池流程';
            case 'vanke_abs':
                return '新万科业务流程';
            case 'specialVerification':
                return '特殊事项审批流程';
            case 'vanke_change':
                return '账号变更流程';
            case 'dragon_book_stop':
                return '龙光台账中止流程';
            case 'dragon_book_change':
                return '修改台账预录入信息';
            case 'system_match_qrs':
                return '系统匹配付款确认书';
            case 'factoring_retreat':
                return '退单流程';


        }

    }
}
