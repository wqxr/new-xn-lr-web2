/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DynamicComponent
 * @summary：动态表单组件接口
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                WuShenghui    移除表单 ngSwitchCase   2019-06-24
 * **********************************************************************
 */
import { FormGroup } from '@angular/forms';

export interface DynamicComponent {
    // 当前行信息
    row: any;
    // 表单组
    form: FormGroup;
    memo?: string;
    svrConfig?: any;
    action?: any;
    mainFlowId?: string;
    step?: any;
}
