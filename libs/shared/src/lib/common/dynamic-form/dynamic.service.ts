/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DynamicComponentService
 * @summary：动态表单服务
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                WuShenghui    移除表单 ngSwitchCase   2019-06-24
 * 1.5                WuShenghui    添加表单配置            2019-06-29
 * **********************************************************************
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicComponentService {
    private defaultFormModule = 'default';
    private provider: {
        [key: string]: {
            /** 组件 */
            components: Map<string | string[], Function>,
            /** 默认组件 */
            default: string | string[],
        }
    } = {} as any;

    getComponentInstance(type: string, formModule: string) {
        return this.getFormComponent(type, formModule) || this.getDefaultForm(type, formModule);
    }

    setComponentInfo(componentCtor: Function, options: { type: string | string[], formModule: string, default?: boolean }) {
        const { type, formModule } = options;

        if (!this.provider[formModule]) {
            this.provider[formModule] = {
                components: new Map<string, Function>(),
                default: ''
            };
        }

        this.provider[formModule].components.set(type, componentCtor);

        if (options.default) {
            this.provider[formModule].default = type;
        }
    }

    private getFormComponent(type: string, formModule: string) {
        const mapObj = this.provider[formModule].components;
        const key = this.getKey(mapObj, type);

        return mapObj.get(key);
    }

    private getKey(mapObj: Map<string | string[], Function>, type: string) {
        const arr = Array.from(mapObj.keys());
        const index = arr.findIndex(x => Array.isArray(x) ? x.includes(type) : x === type);

        return arr[index];
    }

    private getDefaultForm(type: string, formModule: string) {
        const defaultForms = `${this.defaultFormModule}-${formModule.endsWith('-input') ? 'input' : 'show'}`;
        return this.provider[defaultForms].components.get(type);
    }
}
