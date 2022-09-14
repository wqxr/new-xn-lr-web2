import {EventEmitter, Injectable} from '@angular/core';

/**
 *  组建间通讯服务
 */
@Injectable({ providedIn: 'root' })
export class PublicCommunicateService {
    public change = new EventEmitter<any>();

    public constructor() {
        //
    }
}
