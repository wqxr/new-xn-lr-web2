import {Injectable} from '@angular/core';

/**
 *  不同组建中保存变量的值
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    public caCheValue = {} as any;
    // 暂存数据
    public readonly caCheMap = new Map();

    public constructor() {
    }

    /**
     *  保存局部变量
     * @param val 平台服务费率
     */
    public setValue(val: any) {
        this.caCheValue.key = val;

    }

    public setChangeType(val: any) {
        this.caCheValue.changeType = val;
    }

    public setChangeDelType(val: any) {
        this.caCheValue.changeDelType = val;
    }

    public setMainFlowId(val: any) {
        this.caCheValue.mainFlowId = val;
    }

    public setFlowId(val: any) {
        this.caCheValue.flowId = val;
    }


    /**
     *  保存变量
     * @param key 健
     * @param val 值
     */
    public setCacheValue(key: any, val: any) {
        this.caCheMap.set(key, val);
    }

    public clean() {
        this.caCheValue = {} as any;
        this.caCheMap.clear();
    }
}
