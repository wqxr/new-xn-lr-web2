import { Injectable } from '@angular/core';
import { XnService } from './xn.service';
import { ProductType, RequestType, OperatoState } from '../config/enum/point.enum'
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class PointService {
    constructor(private xn: XnService) {}
    setPoint({mainFlowId = null, itemName}) {
        console.log('itemName:', itemName)
        // 该暂时不上线，所以这里暂时先注释，不影响其他功能
        // const userId = window.sessionStorage.getItem('userId');
        // const userName = window.sessionStorage.getItem('userName');
        // const appId = window.sessionStorage.getItem('appId');
        // const orgType = window.sessionStorage.getItem('orgType');
		// const params = {userId, userName, appId, appType: orgType, type: RequestType.PC, productId: ProductType.Factoring, productName: '保理通', operatoState: OperatoState.Success, itemName, remark: null, mainFlowId};
        // XnUtils.jsonToUnderline(params);
        // this.xn.point.post('/api/v1/platform_operation_record/record', params).subscribe(() => {}) 
    }
    getPointData(params: object) {
        XnUtils.jsonToUnderline(params);
        return new Observable((observer) => {
            this.xn.point.post('/api/v1/platform_operation_record/show_submit', params).subscribe((v) => {
                observer.next(v)
            }) 
        });
    }
    downloadFile(params: object, title: string) {
        XnUtils.jsonToUnderline(params);
        this.xn.point.getFileDownload('/api/v1/platform_operation_record/out_put_excel', params).subscribe(res => {
            this.xn.point.save(res._body.body, `${title}.xlsx`);
        })
    }

}
