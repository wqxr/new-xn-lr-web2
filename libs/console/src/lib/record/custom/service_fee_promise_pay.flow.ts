import { IFlowCustom } from '../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';


export class ServiceFeePromisePayFlow implements IFlowCustom {
    constructor(private xn: XnService) {}

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {}

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '保证付款服务费调整申请'
        };
    }
}
