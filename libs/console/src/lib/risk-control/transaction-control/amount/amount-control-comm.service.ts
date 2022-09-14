import {EventEmitter, Injectable} from '@angular/core';

/**
 *  风险控制-额度通讯
 */
@Injectable({ providedIn: 'root' })
export class AmountControlCommService {
    change = new EventEmitter<any>(false);
    change1 = new EventEmitter<any>(false);
    rate = new EventEmitter<any>(false);

    constructor() {
    }
}
