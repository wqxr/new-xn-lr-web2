/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DynamicDecorators
 * @summary：动态表单装饰器
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                WuShenghui    移除表单 ngSwitchCase   2019-06-24
 * **********************************************************************
 */
import { Injector } from '@angular/core';
import { DynamicComponentService } from './dynamic.service';

const injector = Injector.create([
    { provide: 'dynamicComponentService', useClass: DynamicComponentService, deps: [] }
]);

export const dynamicComponentService = injector.get('dynamicComponentService');

export function DynamicForm(options: { type: string | string[], formModule: string, default?: boolean }): ClassDecorator {

    return (constructor: any) => {
        dynamicComponentService.setComponentInfo(constructor, options);
    };
}
