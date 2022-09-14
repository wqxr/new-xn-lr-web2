import { Pipe, PipeTransform } from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';
/**
 *  当前交易状态
 */
@Pipe({ name: 'xnMainFlowStatus' })
export class XnMainFlowStatusPipe implements PipeTransform {
    transform(type, proxy?): string {
        if (!!proxy) {

            return XnFlowUtils.formatStatus(proxy, type); // 根据不同模式匹配主流程记录
        }
        return XnFlowUtils.formatMainFlowStatus(type); // 主流程，两票一个同
    }
}
