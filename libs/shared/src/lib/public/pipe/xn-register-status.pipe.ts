/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：XnRegisterStatusPipe
 * @summary：注册企业状态管道
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-03-22
 * **********************************************************************
 */

import { Pipe, PipeTransform } from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';
/**
 *  当前交易状态
 */
@Pipe({ name: 'xnRegisterStatusPipe' })

export class XnRegisterStatusPipe implements PipeTransform {
    transform(type): string {
        return XnFlowUtils.formatRegisterStatus(type);
    }
}
