import {EventEmitter, Injectable} from '@angular/core';
import {InvoiceChangeModel} from '../public/form/invoice-vanke-input.component';

/**
 *  发票是否已上传通讯服务
 */
@Injectable({ providedIn: 'root' })
export class InvoiceUploadService {
    public change = new EventEmitter<InvoiceChangeModel>();

    public constructor() {
        //
    }
}
