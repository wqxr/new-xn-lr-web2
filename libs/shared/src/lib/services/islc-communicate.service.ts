import {EventEmitter, Injectable} from '@angular/core';

/**
 *  组建间通讯服务 理财
 */
@Injectable({ providedIn: 'root' })
export class IslcCommunicateService {
    public change = new EventEmitter<any>();

    public constructor() {
        //
    }
}
